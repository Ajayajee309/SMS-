async function submitRegistration(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const s = {
    regNo: document.getElementById('regNo').value.trim().toUpperCase(),
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    gender: document.getElementById('gender').value,
    dob: document.getElementById('dob').value,
    blood: document.getElementById('blood').value,
    address: document.getElementById('address').value.trim(),
    father: document.getElementById('father').value.trim(),
    mother: document.getElementById('mother').value.trim(),
    category: document.getElementById('category').value,
    aadhar: document.getElementById('aadhar').value.trim(),
    dept: 'Computer Science & Engineering',
    year: '2nd Year',
    sem: 'Sem 3',
    admYear: new Date().getFullYear().toString(),
    createdAt: new Date().toISOString()
  };

  try {
    // 1. Fetch current DB to get counter and students array
    const res = await fetch('/api/db');
    const db = await res.json();
    
    // 2. Check if regNo already exists
    if (db.students.find(x => x.regNo === s.regNo)) {
      alert('Error: Register Number already exists!');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register Student';
      return;
    }

    // 3. Generate ID
    let counter = parseInt(db.counter || '1000');
    counter++;
    s.id = 'STU' + counter;

    // 4. Update DB
    db.students.push(s);
    db.counter = counter;

    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'students', value: db.students })
    });
    
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'counter', value: counter })
    });

    document.getElementById('registerForm').reset();
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';

  } catch (error) {
    console.error('Registration failed:', error);
    alert('Failed to register. Please try again later.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register Student';
  }
}
