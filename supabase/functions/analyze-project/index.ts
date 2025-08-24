import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();
    
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth header and user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Fetch project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      throw new Error('Project not found or access denied');
    }

    // Fetch tasks data
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (tasksError) {
      throw new Error('Failed to fetch tasks');
    }

    // Calculate project metrics
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(task => task.status === 'completed')?.length || 0;
    const overdueTasks = tasks?.filter(task => {
      return task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
    })?.length || 0;
    
    const progressRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const isProjectOverdue = project.end_date && new Date(project.end_date) < new Date();
    
    // Calculate estimated vs actual hours
    const totalEstimated = tasks?.reduce((sum, task) => sum + (task.estimated_hours || 0), 0) || 0;
    const totalActual = tasks?.reduce((sum, task) => sum + (task.actual_hours || 0), 0) || 0;
    const hoursVariance = totalEstimated > 0 ? ((totalActual - totalEstimated) / totalEstimated) * 100 : 0;

    // Prepare project data for Portia AI analysis
    const projectContext = {
      project: {
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: project.start_date,
        endDate: project.end_date,
        progress: project.progress,
        budget: project.budget
      },
      metrics: {
        totalTasks,
        completedTasks,
        overdueTasks,
        progressRate: Math.round(progressRate),
        isOverdue: isProjectOverdue,
        hoursVariance: Math.round(hoursVariance),
        totalEstimated,
        totalActual
      },
      tasks: tasks?.map(task => ({
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        estimatedHours: task.estimated_hours,
        actualHours: task.actual_hours
      })) || []
    };

    // Call Portia API for advanced analysis
    const portiaApiKey = Deno.env.get('PORTIA_API_KEY');
    let portiaInsights = null;
    let performanceScore = 75; // Default score
    let efficiencyRating = 'good'; // Default rating

    if (portiaApiKey) {
      try {
        console.log('Calling Portia API for project analysis...');
        
        const portiaResponse = await fetch('https://api.portia.ai/v1/analyze', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${portiaApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'project_analysis',
            data: projectContext,
            analysis_type: 'comprehensive'
          }),
        });

        if (portiaResponse.ok) {
          portiaInsights = await portiaResponse.json();
          console.log('Portia API response received');
        } else {
          console.log('Portia API call failed:', portiaResponse.status);
        }
      } catch (error) {
        console.log('Error calling Portia API:', error);
      }
    }

    // Generate local insights and recommendations
    const insights = [];
    const recommendations = [];

    // Performance analysis
    if (progressRate < 30) {
      performanceScore = 40;
      efficiencyRating = 'poor';
      insights.push('Project is significantly behind schedule');
      recommendations.push('Consider reassigning resources or extending timeline');
    } else if (progressRate < 60) {
      performanceScore = 60;
      efficiencyRating = 'average';
      insights.push('Project progress is below expectations');
      recommendations.push('Review task priorities and resource allocation');
    } else if (progressRate >= 90) {
      performanceScore = 95;
      efficiencyRating = 'excellent';
      insights.push('Project is performing exceptionally well');
      recommendations.push('Consider documenting best practices for future projects');
    }

    // Overdue tasks analysis
    if (overdueTasks > 0) {
      insights.push(`${overdueTasks} tasks are overdue`);
      recommendations.push('Prioritize overdue tasks and review their blockers');
    }

    // Hours variance analysis
    if (hoursVariance > 20) {
      insights.push('Significant time estimation variance detected');
      recommendations.push('Improve task estimation accuracy for future projects');
    }

    // Budget analysis (if available)
    if (project.budget && totalActual > 0) {
      const estimatedCost = totalActual * 50; // Assuming $50/hour
      if (estimatedCost > project.budget * 0.8) {
        insights.push('Project is approaching budget limits');
        recommendations.push('Review resource allocation and consider budget adjustments');
      }
    }

    // Combine local and Portia insights
    const finalInsights = {
      local: insights,
      portia: portiaInsights?.insights || null,
      metrics: projectContext.metrics
    };

    const finalRecommendations = {
      local: recommendations,
      portia: portiaInsights?.recommendations || null
    };

    // Store analytics in database
    const { error: analyticsError } = await supabase
      .from('project_analytics')
      .upsert({
        project_id: projectId,
        user_id: user.id,
        performance_score: performanceScore,
        efficiency_rating: efficiencyRating,
        insights: finalInsights,
        recommendations: finalRecommendations,
        analysis_date: new Date().toISOString()
      });

    if (analyticsError) {
      console.log('Error storing analytics:', analyticsError);
    }

    return new Response(JSON.stringify({
      success: true,
      projectId,
      performanceScore,
      efficiencyRating,
      insights: finalInsights,
      recommendations: finalRecommendations,
      metrics: projectContext.metrics
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-project function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});