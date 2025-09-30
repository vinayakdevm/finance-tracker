import React from 'react';
import { BarChart3, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Star } from 'lucide-react';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Dashboard', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Goals', href: '#' },
    { name: 'Transactions', href: '#' },
    { name: 'Reports', href: '#' }
  ];

  const resources = [
    { name: 'Help Center', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  const reviews = [
    { name: 'Sarah J.', rating: 5, text: 'Best financial dashboard I\'ve ever used!' },
    { name: 'Michael R.', rating: 5, text: 'Helped me save $10k in 6 months!' },
    { name: 'Emily W.', rating: 5, text: 'Clean interface, powerful features.' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">FinanceFlow</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Your complete financial management solution. Track expenses, set goals, and achieve financial freedom.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+1-555-123-4567"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </a>
              <a
                href="mailto:support@financeflow.com"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>support@financeflow.com</span>
              </a>
              <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Finance Street<br />New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            What Our Users Say
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 text-center"
              >
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">"{review.text}"</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} FinanceFlow. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
