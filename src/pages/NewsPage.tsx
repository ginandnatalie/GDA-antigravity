import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, ChevronRight, Newspaper } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Mock data for initial design
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Ginashe Digital Academy Launches New Sandton Innovation Hub',
    excerpt: 'We are proud to announce the opening of our world-class campus in the heart of Sandton, designed for the next generation of cloud engineers.',
    category: 'Academy Updates',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    published_at: '2025-04-01T10:00:00Z',
    slug: 'new-sandton-innovation-hub'
  },
  {
    id: '2',
    title: 'The Future of AI in African Fintech: What Students Need to Know',
    excerpt: 'A deep dive into how artificial intelligence is reshaping the financial landscape across the continent and the skills required to lead.',
    category: 'Tech Trends',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    published_at: '2025-04-05T14:30:00Z',
    slug: 'future-of-ai-african-fintech'
  },
  {
    id: '3',
    title: '5 Tips for Transitioning from Traditional IT to Cloud Engineering',
    excerpt: 'Our career experts share the essential roadmap for developers looking to specialize in AWS and Azure environments.',
    category: 'Career Advice',
    image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200',
    published_at: '2025-03-28T09:15:00Z',
    slug: 'it-to-cloud-engineering-roadmap'
  }
];

export default function NewsPage() {
  const [posts, setPosts] = useState<any[]>(MOCK_POSTS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('not found')) {
          setPosts(MOCK_POSTS);
        } else {
          throw error;
        }
      } else if (data && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['All', ...new Set(posts.map(p => p.category))];
  const filteredPosts = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-14">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 font-dm-mono text-[10px] tracking-[0.2em] uppercase text-gold">
            <Newspaper size={14} />
            News & Insights
          </div>
          <h1 className="font-syne font-extrabold text-4xl md:text-6xl max-w-3xl leading-tight">
            The Girashe <span className="text-gold">Intelligence</span> Report
          </h1>
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
            Stay ahead of the curve with our latest updates on technology, career growth, and industry transformation across Africa.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mt-12 border-b border-border-custom pb-6"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full font-dm-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${filter === cat ? 'bg-gold text-bg' : 'text-text-muted hover:text-gold hover:bg-gold-dim'}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="group"
          >
            <Link to={`/news/${post.slug}`} className="block no-underline">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-surface border border-border-custom transition-all duration-500 group-hover:border-gold/50 group-hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)]">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-bg/80 backdrop-blur-md border border-gold/30 rounded-full font-dm-mono text-[9px] tracking-widest uppercase text-gold">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-text-dim font-dm-mono text-[9px] tracking-widest uppercase">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gold" />
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <h3 className="font-syne font-bold text-xl group-hover:text-gold transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-gold font-dm-mono text-[10px] tracking-widest uppercase mt-2 group-hover:gap-4 transition-all duration-300">
                  Read Article <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mt-32 p-12 md:p-16 rounded-[2rem] bg-surface border border-border-custom relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gold/5 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-4">
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl">Weekly Insights <br/>to your <span className="text-gold">Inbox</span></h2>
            <p className="text-text-muted max-w-md">Join over 5,000+ technology leaders and students receiving our curated weekly reports on African tech transformation.</p>
          </div>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your professional email" 
              className="flex-1 bg-bg border border-border-custom rounded-lg px-6 py-4 focus:border-gold outline-none transition-all text-sm"
              required
            />
            <button className="btn btn-gold px-8 whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
