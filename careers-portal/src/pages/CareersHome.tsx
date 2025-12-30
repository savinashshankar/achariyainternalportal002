import { Link } from 'react-router-dom';
import { Building2, GraduationCap, Briefcase, Users, Award, Target } from 'lucide-react';
import { getCategoryCount } from '../data/openings';

export default function CareersHome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Achariya" className="h-8 w-8" />
                        <div>
                            <h1 className="text-base font-bold text-gray-900">Achariya Careers</h1>
                            <p className="text-xs text-gray-600">Join Our Team. Shape the Future.</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    Join Achariya
                </h2>
                <p className="text-sm text-gray-600 mb-3 max-w-3xl mx-auto">
                    School. College. Corporate. One place to apply. Discover opportunities that match your passion.
                </p>
            </section>

            {/* Category Cards */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* School Card */}
                    <Link
                        to="/school"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
                        <Building2 className="w-10 h-10 mb-2 relative z-10" />
                        <h3 className="text-xl font-bold mb-1 relative z-10">School</h3>
                        <p className="text-blue-100 text-xs mb-2 relative z-10">
                            Teachers, coordinators,  staff roles
                        </p>
                        <div className="flex items-center justify-between relative z-10">
                            <span className="text-lg font-bold">{getCategoryCount('School')} Openings</span>
                            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* College Card */}
                    <Link
                        to="/college"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <GraduationCap className="w-16 h-16 mb-4 relative z-10" />
                        <h3 className="text-3xl font-bold mb-2 relative z-10">College</h3>
                        <p className="text-purple-100 mb-4 relative z-10">
                            Faculty, research, and academic support positions
                        </p>
                        <div className="flex items-center justify-between relative z-10">
                            <span className="text-2xl font-bold">{getCategoryCount('College')} Openings</span>
                            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Corporate Card */}
                    <Link
                        to="/corporate"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <Briefcase className="w-16 h-16 mb-4 relative z-10" />
                        <h3 className="text-3xl font-bold mb-2 relative z-10">Corporate</h3>
                        <p className="text-teal-100 mb-4 relative z-10">
                            HR, Finance, IT, Marketing, and Operations roles
                        </p>
                        <div className="flex items-center justify-between relative z-10">
                            <span className="text-2xl font-bold">{getCategoryCount('Corporate')} Openings</span>
                            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Info Sections */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="card text-center">
                        <Users className="w-12 h-12 text-teal-600 mx-auto mb-3" />
                        <h4 className="font-bold text-gray-900 mb-2">Collaborative Culture</h4>
                        <p className="text-sm text-gray-600">Work with passionate educators and professionals dedicated to excellence</p>
                    </div>
                    <div className="card text-center">
                        <Award className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <h4 className="font-bold text-gray-900 mb-2">Growth & Development</h4>
                        <p className="text-sm text-gray-600">Continuous learning opportunities and career advancement paths</p>
                    </div>
                    <div className="card text-center">
                        <Target className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-bold text-gray-900 mb-2">Make an Impact</h4>
                        <p className="text-sm text-gray-600">Shape young minds and contribute to educational excellence</p>
                    </div>
                </div>
            </section>

            {/* Recruitment Process */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
                <div className="card p-3">
                    <h3 className="text-base font-bold text-gray-900 mb-3 text-center">Our Hiring Process</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                            <h5 className="font-bold text-gray-900 mb-1">Apply</h5>
                            <p className="text-sm text-gray-600">Submit your application online</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                            <h5 className="font-bold text-gray-900 mb-1">Shortlist</h5>
                            <p className="text-sm text-gray-600">We review and shortlist candidates</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                            <h5 className="font-bold text-gray-900 mb-1">Interview</h5>
                            <p className="text-sm text-gray-600">Meet our team and showcase skills</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">4</div>
                            <h5 className="font-bold text-gray-900 mb-1">Join Us</h5>
                            <p className="text-sm text-gray-600">Receive offer and onboard</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-3 mt-3">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600 mb-2">
                        Achariya is an Equal Opportunity Employer
                    </p>
                    <p className="text-sm text-gray-500">
                        For queries: <a href="mailto:careers@achariya.org" className="text-teal-600 hover:underline">careers@achariya.org</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
