import React from 'react';
import { CreatorData } from '../types/creator';
import { Users, Heart, MessageCircle, TrendingUp, Star, Download, MapPin, Calendar } from 'lucide-react';

interface CreatorCardProps {
  data: CreatorData;
}

export function CreatorCard({ data }: CreatorCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {data.displayName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{data.displayName}</h2>
              <p className="text-purple-200">@{data.handle}</p>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-purple-300" />
                <span className="text-purple-300 text-sm">{data.niche}</span>
              </div>
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-xl border ${getScoreBg(data.compatibilityScore)}`}>
            <div className={`text-3xl font-bold ${getScoreColor(data.compatibilityScore)}`}>
              {data.compatibilityScore}%
            </div>
            <div className="text-white text-sm font-medium">Compatibility</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{formatNumber(data.followers)}</div>
            <div className="text-purple-200 text-sm">Followers</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{formatNumber(data.avgLikes)}</div>
            <div className="text-purple-200 text-sm">Avg Likes</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <MessageCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{formatNumber(data.avgComments)}</div>
            <div className="text-purple-200 text-sm">Avg Comments</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{data.engagementRate}%</div>
            <div className="text-purple-200 text-sm">Engagement</div>
          </div>
        </div>
      </div>

      {/* Brand Alignment */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Star className="w-5 h-5 text-yellow-400 mr-2" />
          Brand Category Alignment
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.brandAlignment.map((alignment, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white text-sm font-medium">{alignment.category}</span>
                <span className={`text-sm font-bold ${getScoreColor(alignment.score)}`}>
                  {alignment.score}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    alignment.score >= 80 ? 'bg-green-500' : 
                    alignment.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${alignment.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Analysis */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Content Style Analysis</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.contentStyle.map((style, index) => (
            <span key={index} className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-500/30">
              {style}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-3">Audience Demographics</h4>
            <div className="space-y-2">
              {Object.entries(data.audienceDemographics.ageGroups).map(([age, percentage]) => (
                <div key={age} className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">{age}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 bg-purple-500 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-white text-sm w-8">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">Recent Performance</h4>
            <div className="space-y-2">
              {data.recentPosts.map((post, index) => (
                <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-purple-200 text-sm">{post.type}</span>
                  <span className="text-white text-sm font-medium">{formatNumber(post.engagement)} engagements</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Recommendations */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Estimated Pricing
            </h4>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  ${data.priceRange.min} - ${data.priceRange.max}
                </div>
                <div className="text-purple-200 text-sm">Per sponsored post</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">Recommendations</h4>
            <div className="space-y-2">
              {data.compatibilityScore >= 80 && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-300 text-sm">🎯 Excellent brand fit - Highly recommended for partnerships</p>
                </div>
              )}
              {data.engagementRate > 3 && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">💪 Strong engagement rate - Active and engaged audience</p>
                </div>
              )}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                <p className="text-purple-300 text-sm">
                  📊 Best fit for {data.brandAlignment.sort((a, b) => b.score - a.score)[0].category.toLowerCase()} brands
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          
          <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/20">
            Share Analysis
          </button>
        </div>
      </div>
    </div>
  );
}