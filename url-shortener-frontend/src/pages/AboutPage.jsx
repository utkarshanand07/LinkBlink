import React from "react";
import { FaLink, FaShareAlt, FaEdit, FaChartLine } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-white py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-6">
            About LinkBlink.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed font-medium">
            We believe sharing information should be completely frictionless. LinkBlink is designed to transform long, cumbersome URLs into clean, manageable links in seconds, giving you total control over your digital presence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-start">
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <FaLink className="text-black text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-black tracking-tight mb-3">
              Simple Shortening
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Transform long URLs into short, memorable links instantly. Our streamlined interface gets you straight to the point without the clutter.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start">
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <FaShareAlt className="text-black text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-black tracking-tight mb-3">
              Powerful Analytics
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Gain deep insights into your link performance. Track clicks, geographic locations, and referrers to perfectly optimize your reach.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start">
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <FaEdit className="text-black text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-black tracking-tight mb-3">
              Enhanced Security
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Your data's safety is our priority. Every link is protected with industry-standard encryption and robust security protocols.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-start">
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <FaChartLine className="text-black text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-black tracking-tight mb-3">
              Fast and Reliable
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Built for speed and high availability. Enjoy lightning-fast redirects and an infrastructure you can depend on, 24/7.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;