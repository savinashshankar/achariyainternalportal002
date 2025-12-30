interface ApplicationData {
    fullName: string;
    age: string;
    dob: string;
    email: string;
    phone: string;
    previousCompany: string;
    previousDOJ: string;
    lastWorkingDate: string;
    noticePeriodDays: string;
    lastWorkingDay: string;
    currentCTC: string;
    expectedCTC: string;
    category: string;
    roleTitle: string;
    location: string;
    resume: File;
}

// REPLACE THIS with your actual Apps Script Web App URL after deployment
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybhOPIWBEXLqUJiowh2UE6bsw02iuWPmme4RtBV8VTM_tmNKx2I9DdMBSduFUEJIVY/exec';

export async function submitApplication(data: ApplicationData): Promise<string> {
    // Generate reference ID
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const referenceId = `REF-${dateStr}-${random}`;

    try {
        // Convert resume file to base64
        const resumeBase64 = await fileToBase64(data.resume);

        // Prepare payload
        const payload = {
            referenceId,
            timestamp: new Date().toISOString(),
            category: data.category,
            roleTitle: data.roleTitle,
            location: data.location,
            fullName: data.fullName,
            age: data.age,
            dob: data.dob,
            email: data.email,
            phone: data.phone,
            previousCompany: data.previousCompany,
            previousDOJ: data.previousDOJ,
            lastWorkingDate: data.lastWorkingDate,
            noticePeriodDays: data.noticePeriodDays,
            lastWorkingDay: data.lastWorkingDay,
            currentCTC: data.currentCTC,
            expectedCTC: data.expectedCTC,
            resumeFileName: data.resume.name,
            resumeFileType: data.resume.type,
            resumeBase64: resumeBase64
        };

        // Send to Google Apps Script
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // Since mode is 'no-cors', we can't read the response
        // Assume success if no error thrown
        console.log('Application submitted successfully');

        // Also store in localStorage as backup
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications.push({ ...payload, resumeBase64: '[FILE]' }); // Don't store full base64 in localStorage
        localStorage.setItem('applications', JSON.stringify(applications));

        return referenceId;
    } catch (error) {
        console.error('Submission error:', error);

        // Fallback: store in localStorage only
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications.push({
            referenceId,
            timestamp: new Date().toISOString(),
            ...data,
            resume: data.resume.name
        });
        localStorage.setItem('applications', JSON.stringify(applications));

        return referenceId;
    }
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data:application/pdf;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}
