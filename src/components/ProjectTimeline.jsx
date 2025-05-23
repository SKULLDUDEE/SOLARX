import { useState } from 'react';

export default function ProjectTimeline() {
  const [activeMonth, setActiveMonth] = useState('may');
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <section id="timeline" className="py-20 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
            Project Roadmap
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-600">Project Timeline</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Follow our comprehensive project timeline from kickoff to completion, with detailed milestones and deliverables.
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full mt-2"></div>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4 bg-white p-2 rounded-full shadow-lg">
              <button
                onClick={() => setActiveMonth('may')}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  activeMonth === 'may'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                May 2025
              </button>
              <button
                onClick={() => setActiveMonth('june')}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  activeMonth === 'june'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                June 2025
              </button>
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="relative">
            {/* Timeline Line with Animation */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-200 via-orange-300 to-orange-400 rounded-full"></div>

            {/* May Timeline */}
            {activeMonth === 'may' && (
              <div className="space-y-16 transition-all duration-500 ease-out">
                {/* Week 1 */}
                <div
                  className="relative flex items-center justify-between group"
                  onMouseEnter={() => setHoveredItem('week1')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-5/12 pr-8 text-right transform transition-all duration-500 ${hoveredItem === 'week1' ? 'scale-105' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-2">
                      Week 1
                    </span>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Project Kickoff</h3>
                    <p className="text-gray-600">Initial consultation with ISA to finalize project scope and requirements.</p>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-500 ${hoveredItem === 'week1' ? 'scale-125' : ''}`}>
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </div>
                  <div className={`w-5/12 pl-8 transform transition-all duration-500 ${hoveredItem === 'week1' ? 'scale-105' : ''}`}>
                    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="font-semibold text-orange-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Deliverables:
                      </h4>
                      <ul className="text-gray-600 text-sm mt-3 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Project plan document
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Timeline confirmation
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Kickoff meeting minutes
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Week 2 */}
                <div
                  className="relative flex items-center justify-between group"
                  onMouseEnter={() => setHoveredItem('week2')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-5/12 pr-8 text-right transform transition-all duration-500 ${hoveredItem === 'week2' ? 'scale-105' : ''}`}>
                    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="font-semibold text-orange-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Deliverables:
                      </h4>
                      <ul className="text-gray-600 text-sm mt-3 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Research findings report
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Initial design concepts
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Stakeholder feedback summary
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-500 ${hoveredItem === 'week2' ? 'scale-125' : ''}`}>
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </div>
                  <div className={`w-5/12 pl-8 transform transition-all duration-500 ${hoveredItem === 'week2' ? 'scale-105' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-2">
                      Week 2
                    </span>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Research & Design</h3>
                    <p className="text-gray-600">Comprehensive research and initial design phase with stakeholder consultation.</p>
                  </div>
                </div>

                {/* Week 3 */}
                <div
                  className="relative flex items-center justify-between group"
                  onMouseEnter={() => setHoveredItem('week3')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-5/12 pr-8 text-right transform transition-all duration-500 ${hoveredItem === 'week3' ? 'scale-105' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-2">
                      Week 3
                    </span>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Development Phase</h3>
                    <p className="text-gray-600">Implementation of approved designs and development of core components.</p>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-500 ${hoveredItem === 'week3' ? 'scale-125' : ''}`}>
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </div>
                  <div className={`w-5/12 pl-8 transform transition-all duration-500 ${hoveredItem === 'week3' ? 'scale-105' : ''}`}>
                    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="font-semibold text-orange-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Deliverables:
                      </h4>
                      <ul className="text-gray-600 text-sm mt-3 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Development progress report
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Prototype demonstration
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Technical documentation
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Week 4 */}
                <div
                  className="relative flex items-center justify-between group"
                  onMouseEnter={() => setHoveredItem('week4')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-5/12 pr-8 text-right transform transition-all duration-500 ${hoveredItem === 'week4' ? 'scale-105' : ''}`}>
                    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="font-semibold text-orange-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Deliverables:
                      </h4>
                      <ul className="text-gray-600 text-sm mt-3 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Testing results document
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Quality assurance report
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Mid-project review presentation
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-500 ${hoveredItem === 'week4' ? 'scale-125' : ''}`}>
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </div>
                  <div className={`w-5/12 pl-8 transform transition-all duration-500 ${hoveredItem === 'week4' ? 'scale-105' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-2">
                      Week 4
                    </span>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Testing & Review</h3>
                    <p className="text-gray-600">Comprehensive testing and mid-project review with ISA stakeholders.</p>
                  </div>
                </div>
              </div>
            )}

            {/* June Timeline */}
            {activeMonth === 'june' && (
              <div className="space-y-16 transition-all duration-500 ease-out">
                {/* Week 5 */}
                <div
                  className="relative flex items-center justify-between group"
                  onMouseEnter={() => setHoveredItem('week5')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-5/12 pr-8 text-right transform transition-all duration-500 ${hoveredItem === 'week5' ? 'scale-105' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-2">
                      Week 5
                    </span>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Refinement Phase</h3>
                    <p className="text-gray-600">Implementation of feedback and refinement of deliverables.</p>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-500 ${hoveredItem === 'week5' ? 'scale-125' : ''}`}>
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </div>
                  <div className={`w-5/12 pl-8 transform transition-all duration-500 ${hoveredItem === 'week5' ? 'scale-105' : ''}`}>
                    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="font-semibold text-orange-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Deliverables:
                      </h4>
                      <ul className="text-gray-600 text-sm mt-3 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Refined components
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Updated documentation
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Progress report
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Week 6 */}
                <div
                  className="relative flex items-center justify-between group"
                  onMouseEnter={() => setHoveredItem('week6')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-5/12 pr-8 text-right transform transition-all duration-500 ${hoveredItem === 'week6' ? 'scale-105' : ''}`}>
                    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="font-semibold text-orange-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Deliverables:
                      </h4>
                      <ul className="text-gray-600 text-sm mt-3 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Integration report
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          System performance metrics
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          User acceptance testing plan
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-500 ${hoveredItem === 'week6' ? 'scale-125' : ''}`}>
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </div>
                  <div className={`w-5/12 pl-8 transform transition-all duration-500 ${hoveredItem === 'week6' ? 'scale-105' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-2">
                      Week 6
                    </span>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Integration & Validation</h3>
                    <p className="text-gray-600">Final integration of all components and comprehensive validation.</p>
                  </div>
                </div>

                {/* Week 7 */}
                <div
                  className="relative flex items-center justify-between group"
                  onMouseEnter={() => setHoveredItem('week7')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-5/12 pr-8 text-right transform transition-all duration-500 ${hoveredItem === 'week7' ? 'scale-105' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-2">
                      Week 7
                    </span>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">User Acceptance Testing</h3>
                    <p className="text-gray-600">Final testing with stakeholders and implementation of last-minute adjustments.</p>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-500 ${hoveredItem === 'week7' ? 'scale-125' : ''}`}>
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </div>
                  <div className={`w-5/12 pl-8 transform transition-all duration-500 ${hoveredItem === 'week7' ? 'scale-105' : ''}`}>
                    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="font-semibold text-orange-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Deliverables:
                      </h4>
                      <ul className="text-gray-600 text-sm mt-3 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          UAT results document
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Stakeholder feedback summary
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Final adjustments report
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Week 8 (Final) */}
                <div
                  className="relative flex items-center justify-between group"
                  onMouseEnter={() => setHoveredItem('week8')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`w-5/12 pr-8 text-right transform transition-all duration-500 ${hoveredItem === 'week8' ? 'scale-105' : ''}`}>
                    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="font-semibold text-orange-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Deliverables:
                      </h4>
                      <ul className="text-gray-600 text-sm mt-3 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Final project deliverables
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Comprehensive documentation
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Project completion report
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                          Knowledge transfer materials
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center z-10 shadow-xl transition-all duration-500 ${hoveredItem === 'week8' ? 'scale-125' : ''}`}>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className={`w-5/12 pl-8 transform transition-all duration-500 ${hoveredItem === 'week8' ? 'scale-105' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-2">
                      Week 8
                    </span>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Project Completion</h3>
                    <p className="text-gray-600">Final delivery of all project components, documentation, and knowledge transfer.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        
         
        </div>
      </div>
    </section>
  );
}