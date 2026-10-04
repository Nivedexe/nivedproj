
const fixTest = async () => {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@gmail.com',
                password: 'pass-admin@123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful.');

        // 2. Fetch Test
        const testRes = await fetch('http://localhost:5000/api/tests', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tests = await testRes.json();

        if (tests.length === 0) {
            console.log('No tests found to fix.');
            return;
        }

        const test = tests[0];
        console.log('Fixing test:', test.title);

        // 3. Fix Questions
        const fixedQuestions = test.questions.map(q => ({
            ...q,
            type: q.type || 'single-choice', // Default to single-choice if missing
            options: q.options ? q.options.map((opt, idx) => ({
                ...opt,
                score: opt.score !== undefined ? opt.score : idx // Default score to index if missing
            })) : []
        }));

        // 4. Update Test
        const updateRes = await fetch(`http://localhost:5000/api/tests/${test.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...test,
                questions: fixedQuestions
            })
        });

        if (updateRes.ok) {
            console.log('Test updated successfully with fixed question types.');
        } else {
            console.log('Failed to update test:', await updateRes.text());
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

fixTest();
