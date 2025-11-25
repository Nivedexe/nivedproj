
const debugTest = async () => {
    try {
        console.log('Attempting login...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@gmail.com',
                password: 'pass-admin@123'
            })
        });

        const loginText = await loginRes.text();
        console.log('Login Response Status:', loginRes.status);

        let loginData;
        try {
            loginData = JSON.parse(loginText);
        } catch (e) {
            console.log('Login Response Text:', loginText);
            throw new Error('Failed to parse login response');
        }

        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Fetch Tests
        const testRes = await fetch('http://localhost:5000/api/tests', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const testText = await testRes.text();
        console.log('Test Response Status:', testRes.status);

        let tests;
        try {
            tests = JSON.parse(testText);
        } catch (e) {
            console.log('Test Response Text:', testText);
            throw new Error('Failed to parse test response');
        }

        if (tests.length === 0) {
            console.log('No tests found.');
        } else {
            const test = tests[0];
            console.log('Test found:', test.title);
            console.log('Questions length:', test.questions ? test.questions.length : 'undefined');

            if (test.questions && test.questions.length > 0) {
                console.log('First Question Type:', test.questions[0].type);
                console.log('First Question Options:', JSON.stringify(test.questions[0].options, null, 2));
            }
            if (test.questions && test.questions.length > 1) {
                console.log('Second Question Type:', test.questions[1].type);
                console.log('Second Question:', JSON.stringify(test.questions[1], null, 2));
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

debugTest();
