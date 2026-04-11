import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, ChevronRight, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Mock data for initial design
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Ginashe Digital Academy Launches New Sandton Innovation Hub',
    excerpt: 'We are proud to announce the opening of our world-class campus in the heart of Sandton, designed for the next generation of cloud engineers.',
    content: `
      <p>Ginashe Digital Academy (GDA) has officially opened the doors to its new flagship <strong>Innovation Hub in Sandton, Johannesburg</strong>. The state-of-the-art facility is more than just a campus; it is a hub for transformation, collaboration, and high-performance learning.</p>
      
      <h3>A Vision for African Talent</h3>
      <p>As Africa accelerates its digital transformation, the demand for certified cloud architects and AI specialists has never been higher. The Sandton Hub was designed specifically to bridge the gap between traditional tertiary education and the rapidly evolving tech industry.</p>
      
      <blockquote>
        "Our mission is to create an environment that mimics the global tech offices of Silicon Valley and London, right here in the heart of Africa's financial capital."
      </blockquote>

      <h3>What's Inside the Hub?</h3>
      <ul>
        <li><strong>Hyper-Cloud Labs:</strong> Dedicated spaces for hands-on AWS and Azure architecture simulations.</li>
        <li><strong>AI Research Lounge:</strong> A collaborative zone for students focused on Generative AI and Machine Learning.</li>
        <li><strong>Industry Interaction Zones:</strong> Where students can network directly with our corporate partners.</li>
      </ul>

      <p>The Sandton Hub will host the upcoming April intake for our Cloud Engineering and Data Science programs. Applications are now open for both full-time and executive weekend formats.</p>
    `,
    category: 'Academy Updates',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    published_at: '2026-04-01T10:00:00Z',
    slug: 'new-sandton-innovation-hub',
    author: 'Dr. Girashe, Head of Academy'
  }
];

export default function NewsDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, author:profiles(first_name, last_name)')
        .eq('slug', slug)
        .single();
      
      if (error) {
        // Fallback to mock data for design preview
        const mock = MOCK_POSTS.find(p => p.slug === slug);
        if (mock) setPost(mock);
        else navigate('/news');
      } else {
        setPost(data);
      }
    } catch (err) {
      const mock = MOCK_POSTS.find(p => p.slug === slug);
      if (mock) setPost(mock);
      else navigate('/news');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
    </div>
  );

  if (!post) return null;

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Article Hero */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/news" className="inline-flex items-center gap-2 text-text-muted hover:text-gold transition-colors font-dm-mono text-[10px] tracking-widest uppercase mb-8 group">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back to News
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full font-dm-mono text-[9px] tracking-widest uppercase">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-text-dim text-[10px] font-dm-mono uppercase tracking-widest">
              <Clock size={14} /> 6 MIN READ
            </div>
          </div>

          <h1 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-border-custom">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface border border-gold/20 flex items-center justify-center text-gold">
                <User size={20} />
              </div>
              <div>
                <div className="text-[12px] font-bold text-text-custom">{post.author?.first_name ? `${post.author.first_name} ${post.author.last_name}` : post.author || 'GDA Insights Team'}</div>
                <div className="text-[10px] text-text-dim font-dm-mono uppercase tracking-widest">Lead Strategist</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gold" />
              <div>
                <div className="text-[12px] font-bold text-text-custom">{new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div className="text-[10px] text-text-dim font-dm-mono uppercase tracking-widest">Published On</div>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button className="p-2 rounded-full border border-border-custom hover:border-gold/50 hover:text-gold transition-all"><Twitter size={16} /></button>
              <button className="p-2 rounded-full border border-border-custom hover:border-gold/50 hover:text-gold transition-all"><Linkedin size={16} /></button>
              <button className="p-2 rounded-full border border-border-custom hover:border-gold/50 hover:text-gold transition-all"><Share2 size={16} /></button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Image */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-surface border border-border-custom"
        >
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-[1fr_80px] gap-12">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-gold max-w-none"
        >
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="text-text-soft leading-[1.8] text-lg space-y-8"
          />
          
          <div className="mt-16 pt-8 border-t border-border-custom flex flex-wrap gap-2">
            <span className="flex items-center gap-2 text-text-dim text-[10px] font-dm-mono uppercase tracking-widest mr-4">
              <Tag size={12} /> Tags:
            </span>
            {['Cloud', 'Innovation', 'South Africa', 'Careers'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-surface border border-border-custom rounded-md text-[10px] font-dm-mono text-text-muted hover:text-gold transition-colors cursor-pointer">#{tag}</span>
            ))}
          </div>
        </motion.article>

        {/* Floating Sidebar (Desktop) */}
        <div className="hidden md:flex flex-col gap-6 sticky top-32 h-fit">
           <div className="w-px h-24 bg-gradient-to-b from-gold to-transparent mx-auto"></div>
           <span className="font-dm-mono text-[9px] tracking-widest uppercase vertical-text text-text-dim rotate-180">Article Progress</span>
        </div>
      </div>

      {/* Related Posts? */}
      <div className="max-w-7xl mx-auto px-6 mt-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-syne font-extrabold text-3xl">Continue <span className="text-gold">Reading</span></h2>
          <Link to="/news" className="text-gold font-dm-mono text-[10px] tracking-widest uppercase flex items-center gap-2 hover:gap-4 transition-all">
            All Insights <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
           {MOCK_POSTS.filter(p => p.id !== post.id).slice(0, 2).map((p) => (
             <Link key={p.id} to={`/news/${p.slug}`} className="group block bg-surface/50 border border-border-custom rounded-3xl p-6 hover:border-gold/30 transition-all">
                <div className="flex gap-6 items-center">
                  <img src={p.image_url} className="w-32 h-32 rounded-xl object-cover" />
                  <div>
                    <span className="text-gold font-dm-mono text-[9px] tracking-widest uppercase mb-2 block">{p.category}</span>
                    <h4 className="font-syne font-bold text-lg group-hover:text-gold transition-colors line-clamp-2">{p.title}</h4>
                  </div>
                </div>
             </Link>
           ))}
        </div>
      </div>
    </div>
  );
}
