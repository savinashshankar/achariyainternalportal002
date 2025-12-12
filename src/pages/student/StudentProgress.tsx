import BackButton from '../../components/BackButton';

const StudentProgress = () => {
    const courses = [
        { id: 1, name: 'Advanced Mathematics', progress: 85, modules: 3, completed: 2, color: 'from-blue-500 to-cyan-500' },
        { id: 2, name: 'Physics', progress: 60, modules: 3, completed: 1, color: 'from-purple-500 to-pink-500' },
        { id: 3, name: 'English Literature', progress: 45, modules: 2, completed: 0, color: 'from-green-500 to-emerald-500' }
    ];

    const skills = [
        { name: 'Problem Solving', level: 8, max: 10, color: 'blue' },
        { name: 'Critical Thinking', level: 7, max: 10, color: 'purple' },
        { name: 'Time Management', level: 6, max: 10, color: 'green' },
        { name: 'Quiz Accuracy', level: 9, max: 10, color: 'yellow' }
    ];

    return (
        <div>
            <BackButton />
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Learning Journey</h1>

            {/* Overall Progress */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Total Completion</p>
                        <p className="text-5xl font-bold">63%</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Courses</p>
                        <p className="text-5xl font-bold">3</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Modules Done</p>
                        <p className="text-5xl font-bold">5/8</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Study Time</p>
                        <p className="text-5xl font-bold">42h</p>
                    </div>
                </div>
            </div>

            {/* Course Progress Map */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Progress</h2>
                {courses.map((course, idx) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm p-6 border mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${course.color} flex items-center justify-center text-white font-bold text-xl`}>
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                                    <p className="text-sm text-gray-600">{course.completed}/{course.modules} modules completed</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-blue-600">{course.progress}%</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className={`bg-gradient-to-r ${course.color} h-4 rounded-full transition-all duration-500`}
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Skill Levels */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Skill Development</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map(skill => (
                        <div key={skill.name} className="bg-white rounded-xl shadow-sm p-6 border">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-gray-800">{skill.name}</span>
                                <span className="text-sm text-gray-600">Level {skill.level}/{skill.max}</span>
                            </div>
                            <div className="flex gap-1">
                                {Array.from({ length: skill.max }).map((_, i) => (
                                    <div key={i} className={`flex-1 h-3 rounded ${i < skill.level ? `bg-${skill.color}-500` : 'bg-gray-200'
                                        }`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Activity */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Activity</h2>
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex justify-around items-end h-48">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            const heights = [60, 45, 80, 70, 90, 30, 50];
                            return (
                                <div key={day} className="flex flex-col items-center gap-2">
                                    <div
                                        className="w-12 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all hover:opacity-80"
                                        style={{ height: `${heights[i]}%` }}
                                    />
                                    <p className="text-xs text-gray-600">{day}</p>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-center text-gray-600 mt-4">Minutes studied per day</p>
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;
