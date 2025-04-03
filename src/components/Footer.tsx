
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-lg">
                z
              </div>
              <span className="text-2xl lowercase font-bold font-display tracking-tight text-white">
                zenx
              </span>
            </Link>
            <p className="text-zinc-400 text-sm mb-4 max-w-xs">
              Elevate your coding skills with our comprehensive platform designed for serious developers.
            </p>
            <div className="flex items-center gap-4">
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Youtube className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/problems" className="text-zinc-400 hover:text-white transition-colors">Problems</Link></li>
              <li><Link to="/challenges" className="text-zinc-400 hover:text-white transition-colors">Challenges</Link></li>
              <li><Link to="/leaderboard" className="text-zinc-400 hover:text-white transition-colors">Leaderboard</Link></li>
              <li><Link to="/compiler" className="text-zinc-400 hover:text-white transition-colors">Compiler</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-zinc-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-zinc-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-zinc-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-zinc-400 hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
          <p>© {currentYear} ZenX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
