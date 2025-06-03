const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Mock AI Content Generator
class ContentGenerator {
  static async generateBlog(sourceContent, context = '') {
    return {
      title: "Transform Your Marketing Strategy: Key Insights from Industry Leaders",
      content: `# Transform Your Marketing Strategy: Key Insights from Industry Leaders

## The Marketing Landscape is Evolving Fast

Today's marketers face unprecedented challenges. Consumer behavior shifts daily, platforms evolve constantly, and what worked yesterday might fail tomorrow. But here's the thing – the most successful brands aren't just adapting; they're anticipating.

## What the Data Really Shows

Recent studies reveal that **personalized content performs 6x better** than generic messaging. This isn't just about adding someone's name to an email. It's about understanding their journey, their pain points, and their aspirations.

### The Three Pillars of Modern Marketing

1. **Authenticity Over Perfection**
   - Consumers crave genuine connections
   - Behind-the-scenes content outperforms polished ads
   - Vulnerability builds trust faster than authority

2. **Community-Driven Growth**
   - User-generated content drives 7x more engagement
   - Brand advocates are worth their weight in gold
   - Conversations matter more than broadcasts

3. **Data-Informed Creativity**
   - Analytics guide strategy, not creativity
   - A/B testing reveals surprising insights
   - The best campaigns blend art and science

## Your Next Steps

Stop chasing every trend. Instead, focus on building genuine relationships with your audience. Start conversations, not campaigns. Listen more than you speak.

The future belongs to marketers who understand that behind every click, view, and conversion is a real person with real needs.

*Ready to transform your approach? The time is now.*`,
      citations: [
        {
          text: "personalized content performs 6x better",
          url: "https://www.salesforce.com/resources/articles/personalization/",
          source: "Salesforce State of Marketing Report 2024"
        }
      ]
    };
  }

  static async generateDerivativeContent(blogContent, platform, blogTitle, context = '') {
    const responses = {
      linkedin: [
        {
          content: `🎯 Marketing isn't about perfect campaigns anymore—it's about perfect conversations.

I just dove deep into why authenticity beats perfection every single time. The data is eye-opening:

→ Personalized content performs 6x better
→ User-generated content drives 7x more engagement  
→ Behind-the-scenes content outperforms polished ads

The brands winning today? They're not just adapting to change—they're anticipating it.

What's your take: Are you building campaigns or building relationships?

Read the full breakdown: [Link to blog]

#MarketingStrategy #Authenticity #CustomerEngagement #MarketingTips`,
          type: "Professional insight"
        },
        {
          content: `Stop chasing every marketing trend. Start chasing genuine connections. 

Here's what I learned from analyzing the most successful marketing campaigns of 2024:

The secret isn't in the latest platform or AI tool. It's in understanding that behind every metric is a real person with real needs.

Three game-changing insights that transformed my approach:
1. Vulnerability builds trust faster than authority
2. Community-driven growth beats paid acquisition
3. Data should guide strategy, not kill creativity

Ready to shift from broadcasts to conversations?

Full insights here: [Link to blog]

#MarketingLeadership #CommunityBuilding #DataDriven #MarketingInsights`,
          type: "Thought leadership"
        },
        {
          content: `📊 "Personalized content performs 6x better than generic messaging."

But here's what most marketers get wrong about personalization...

It's not about adding someone's name to an email. It's about understanding their journey, their pain points, and their aspirations.

I just published a deep dive into the three pillars of modern marketing that are actually moving the needle:

✅ Authenticity over perfection
✅ Community-driven growth  
✅ Data-informed creativity

The marketing landscape is evolving fast. The question is: Are you evolving with it?

Dive deeper: [Link to blog]

#Personalization #MarketingStrategy #CustomerJourney #MarketingROI`,
          type: "Data-driven"
        }
      ],
      twitter: [
        {
          content: `Marketing isn't about perfect campaigns anymore—it's about perfect conversations. 

The data is clear: authenticity beats perfection every time.

New post breaks down why 👇
[Link]

#MarketingStrategy #Authenticity`,
          type: "Hook-driven"
        },
        {
          content: `🎯 Personalized content = 6x better performance
🎯 User-generated content = 7x more engagement
🎯 Behind-the-scenes > polished ads

The marketing playbook has changed. Have you?

Full breakdown: [Link]

#MarketingTips #DataDriven`,
          type: "Stat-heavy"
        },
        {
          content: `Stop chasing trends.
Start chasing connections.

The brands winning today aren't just adapting—they're anticipating.

Here's how: [Link]

#Marketing #Strategy`,
          type: "Motivational"
        }
      ],
      email: [
        {
          subject: "The marketing secret hiding in plain sight",
          preview: "Why authenticity beats perfection (and the data proves it)",
          type: "Curiosity-driven"
        },
        {
          subject: "6x better results with this one shift",
          preview: "From campaigns to conversations: your new playbook",
          type: "Benefit-focused"
        },
        {
          subject: "Your marketing strategy is probably wrong",
          preview: "3 pillars that actually move the needle in 2024",
          type: "Contrarian"
        }
      ]
    };

    return responses[platform] || [];
  }
}

// Routes
app.post('/api/generate-blog', async (req, res) => {
  try {
    const { content, context } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const blog = await ContentGenerator.generateBlog(content, context);
    res.json(blog);
  } catch (error) {
    console.error('Blog generation error:', error);
    res.status(500).json({ error: 'Failed to generate blog content' });
  }
});

app.post('/api/generate-derivative', async (req, res) => {
  try {
    const { blogContent, platform, blogTitle, context } = req.body;
    
    if (!blogContent || !platform) {
      return res.status(400).json({ error: 'Blog content and platform are required' });
    }

    if (!['linkedin', 'twitter', 'email'].includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform. Must be linkedin, twitter, or email' });
    }

    const derivativeContent = await ContentGenerator.generateDerivativeContent(
      blogContent, 
      platform, 
      blogTitle,
      context
    );
    
    res.json({ platform, content: derivativeContent });
  } catch (error) {
    console.error('Derivative content generation error:', error);
    res.status(500).json({ error: 'Failed to generate derivative content' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ContentCraft running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
