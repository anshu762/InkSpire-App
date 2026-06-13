import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api' });

async function runTests() {
  console.log("🚀 Starting backend integration tests...");
  try {
    // 1. Register User A
    console.log("📝 Registering User A...");
    const resA = await api.post('/auth/register', { email: `usera_${Date.now()}@test.com`, password: 'Password123!', displayName: 'User A' });
    const tokenA = resA.data.data.accessToken;
    const userIdA = resA.data.data.user.id;
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenA}`;
    
    // Update User A Profile
    console.log("📝 Updating User A Profile...");
    await api.patch('/users/me', { genres: ['FANTASY', 'SCI_FI'], bio: 'Hello I am A' });

    // 2. Register User B
    console.log("📝 Registering User B...");
    delete api.defaults.headers.common['Authorization'];
    const resB = await api.post('/auth/register', { email: `userb_${Date.now()}@test.com`, password: 'Password123!', displayName: 'User B' });
    const tokenB = resB.data.data.accessToken;
    const userIdB = resB.data.data.user.id;
    
    // Update User B Profile
    console.log("📝 Updating User B Profile...");
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenB}`;
    await api.patch('/users/me', { genres: ['FANTASY', 'ROMANCE'], bio: 'Hello I am B' });

    // 3. User B fetches Discover Feed
    console.log("🔍 Fetching Discover Feed for User B...");
    const feedRes = await api.get('/users/discover');
    console.log(`Feed count: ${feedRes.data.data.length}`);
    const foundUserA = feedRes.data.data.find((u: any) => u.id === userIdA);
    if (!foundUserA) {
      console.log("❌ User A not found in discover feed!");
    } else {
      console.log(`✅ User A found in feed with score: ${foundUserA.matchScore}`);
    }

    // 4. User B sends match request to User A
    console.log("💌 User B sending match request to User A...");
    const reqRes = await api.post('/matches/request', { receiveeId: userIdA });
    const matchId = reqRes.data.id;
    console.log("✅ Match request sent!");

    // 5. User A checks incoming requests
    console.log("📥 User A checking incoming requests...");
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenA}`;
    const aReqs = await api.get('/matches/requests');
    if (aReqs.data.incoming.length > 0 && aReqs.data.incoming[0].id === matchId) {
      console.log("✅ Request found in User A's incoming queue");
    } else {
      console.log("❌ Request not found!");
    }

    // 6. User A accepts the request
    console.log("🤝 User A accepting request...");
    await api.post(`/matches/${matchId}/accept`);
    console.log("✅ Request accepted!");

    // 7. Check User A's profile stats
    console.log("📊 Checking User A stats...");
    const meRes = await api.get('/users/me');
    if (meRes.data.totalMatches === 1) {
      console.log("✅ User A has 1 match!");
    } else {
      console.log(`❌ User A has ${meRes.data.totalMatches} matches!`);
    }

    console.log("🎉 All tests passed successfully!");
  } catch (error: any) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

runTests();
