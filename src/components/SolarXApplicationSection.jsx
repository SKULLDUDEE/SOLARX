import React, { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  Shield, 
  TrendingUp, 
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SolarXApplicationSection = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const totalSteps = 6;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreedToTerms) {
      console.log('Form submitted:', formData);
      alert('Application submitted successfully!');
    } else {
      alert('Please agree to the terms and conditions');
    }
  };

  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <section id="apply" className="py-20 bg-white relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-600">
            Apply to SolarX Challenge
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Join our global community of solar innovators and access funding, mentorship, and resources to scale your impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Who Should Apply */}
          <div>
            <div className="bg-orange-50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-100 rounded-full -ml-20 -mb-20"></div>

              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Who Should Apply?</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Early to Growth Stage Startups</h4>
                      <p className="text-gray-600">Solar startups that have a proven product or service with initial traction in the market.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Regional Focus</h4>
                      <p className="text-gray-600">Based in or primarily serving Africa, Asia-Pacific, Latin America & Caribbean, or Middle East & North Africa.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Impact-Driven</h4>
                      <p className="text-gray-600">Committed to creating measurable social, economic, and environmental impact through solar innovation.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Scalable Solutions</h4>
                      <p className="text-gray-600">Innovative solar technologies or business models with potential for significant scale and replication.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white rounded-2xl border border-orange-100">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">Key Dates</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Calendar className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                      Application Opens: May 1, 2025
                    </li>
                    <li className="flex items-start">
                      <Calendar className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                      Application Deadline: June 30, 2025
                    </li>
                    <li className="flex items-start">
                      <Calendar className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                      Finalist Announcement: July 15, 2025
                    </li>
                    <li className="flex items-start">
                      <Calendar className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                      Final Pitch Event: August 10, 2025
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100 h-[900px] transition-all duration-300">
              <div className="p-8 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Application Form</h3>

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0">
                  {/* Progress indicator */}
                  <div className="mb-8 flex-shrink-0">
                    <div className="flex justify-between">
                      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            step >= i ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-200'
                          }`}>
                            <span>{i}</span>
                          </div>
                          <div className="text-xs mt-1 text-gray-500">Step {i}</div>
                        </div>
                      ))}
                    </div>
                    <div className="w-full bg-gray-200 h-1 mt-4 rounded-full">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                      <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">1. Name of the Startup</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('startupName', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">2. Representative Name</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('representativeName', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">3. Designation</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('designation', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">4. Email ID</label>
                            <input 
                              type="email"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">5. Mobile Number</label>
                            <input 
                              type="tel"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('mobile', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">6. Country (of Office Headquarters)</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('country', e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">7. Incorporated Office Address</label>
                          <textarea 
                            rows="3"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => handleInputChange('address', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Online Presence & Co-Founders */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">8. LinkedIn</label>
                            <input 
                              type="url"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('linkedin', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">9. Website</label>
                            <input 
                              type="url"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('website', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">10. Co-Founder Name(s)</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('coFounderNames', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">11. Co-Founder Email ID(s)</label>
                            <input 
                              type="email"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('coFounderEmails', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">12. Year of Incorporation</label>
                            <input 
                              type="number"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('incorporationYear', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">
                              13. Certificate of Incorporation <span className="text-xs text-gray-500">(Original version)</span>
                            </label>
                            <input 
                              type="file"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('incorporationCertificate', e.target.files[0])}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">14. Describe the uniqueness of your product/service</label>
                          <textarea 
                            rows="6"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => handleInputChange('uniqueness', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Problem & Solution */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">15. Which problem statement of the SolarX Challenge are you applying for?</label>
                          <select 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                          >
                            <option>Select problem statement</option>
                            <option>Solar Home Systems</option>
                            <option>Mini/Micro Grids</option>
                            <option>Solar Irrigation</option>
                            <option>Solar Manufacturing</option>
                            <option>Energy Storage</option>
                            <option>Solar Appliances</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">16. What challenge in the solar energy sector is your Venture/Idea solving?</label>
                          <p className="text-xs text-gray-500 mb-2">Please be specific.</p>
                          <textarea 
                            rows="3"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => handleInputChange('challengeSolving', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">17. What is the estimated market size of your idea/solution?</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('marketSize', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">18. What key intellectual property does the company have?</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('intellectualProperty', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">19. Please upload an image of your startup's minimum viable product/ service.</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('mvpImage', e.target.files[0])}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">20. Please upload a pitch deck of your business (in pdf format).</label>
                            <input 
                              type="file" 
                              accept=".pdf"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('pitchDeck', e.target.files[0])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Team Information */}
                    {step === 4 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">21. Current team size</label>
                            <input 
                              type="number"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('teamSize', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">22. Does your team have a woman founder/co-founder(s)?</label>
                            <div className="flex space-x-4 mt-3">
                              <div className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="woman_founder" 
                                  id="yes_woman" 
                                  className="mr-2"
                                  onChange={() => handleInputChange('womanFounder', 'yes')}
                                />
                                <label htmlFor="yes_woman">Yes</label>
                              </div>
                              <div className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="woman_founder" 
                                  id="no_woman" 
                                  className="mr-2"
                                  onChange={() => handleInputChange('womanFounder', 'no')}
                                />
                                <label htmlFor="no_woman">No</label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">23. How is your team uniquely positioned to solve the selected problem statement?</label>
                          <textarea 
                            rows="6"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => handleInputChange('teamPosition', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">24. Please upload team CV(s) (Founder's CV mandatory)</label>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => handleInputChange('teamCVs', e.target.files[0])}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 5: Financial Information */}
                    {step === 5 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">25. Revenue (USD Mn) as of latest FY</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('revenue', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">26. Please share reference code (if any)</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onChange={(e) => handleInputChange('referenceCode', e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">27. Please upload financial statements for the last 3 years</label>
                          <p className="text-xs text-gray-500 mb-2">(In case your startup has been operating for less than 3 years; please upload for the years of operations)</p>
                          <input 
                            type="file" 
                            accept=".pdf,.xls,.xlsx,.doc,.docx"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => handleInputChange('financialStatements', e.target.files[0])}
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">28. How do you intend to utilize the funds and support provided; should you be selected?</label>
                          <textarea 
                            rows="6"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => handleInputChange('fundsUtilization', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 6: Terms & Conditions */}
                    {step === 6 && (
                      <div className="space-y-6">
                        <div className="bg-orange-50 p-6 rounded-lg">
                          <h4 className="text-lg font-bold text-gray-800 mb-4">Terms and Conditions</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            By submitting this application, you agree to the following terms and conditions:
                          </p>
                          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 mb-4">
                            <li>All information provided is accurate and complete to the best of your knowledge.</li>
                            <li>You have the authority to submit this application on behalf of the startup.</li>
                            <li>You agree to participate in the SolarX Challenge program if selected.</li>
                            <li>You understand that submission of this application does not guarantee selection.</li>
                            <li>You agree to provide additional information if requested during the selection process.</li>
                          </ul>

                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="terms" 
                              className="mr-2"
                              checked={agreedToTerms}
                              onChange={(e) => setAgreedToTerms(e.target.checked)}
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                              I agree to the terms and conditions and privacy policy
                            </label>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg">
                          <h4 className="text-lg font-bold text-gray-800 mb-4">Application Summary</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Please review your application before submitting. Once submitted, you will receive a confirmation email with a copy of your application.
                          </p>
                          <p className="text-sm text-gray-600">
                            If you need to make changes after submission, please contact us at{' '}
                            <a href="mailto:support@solarxchallenge.com" className="text-orange-500 hover:underline">
                              support@solarxchallenge.com
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="mt-8 flex justify-between flex-shrink-0">
                    {step > 1 && (
                      <button 
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-all flex items-center"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </button>
                    )}
                    
                    <div className="flex-grow"></div>

                    {step < totalSteps ? (
                      <button 
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all"
                      >
                        Submit Application
                      </button>
                    )}
                  </div>

                  <p className="text-gray-500 mt-4 text-center">Application deadline: June 30, 2025</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolarXApplicationSection;