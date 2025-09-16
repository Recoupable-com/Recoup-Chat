#!/usr/bin/env node

/**
 * Performance test script for Recent Chats API endpoint
 * Tests the /api/room/get endpoint that loads conversations + memories
 * 
 * Usage: node test_recent_chats_performance.js [account_id]
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_ACCOUNT_ID = process.argv[2] || '848cd58d-700f-4b38-ab4c-d9f526402e3c';
const NUM_TESTS = 5; // Number of test runs for averaging

console.log('🚀 Recent Chats Performance Test');
console.log('================================');
console.log(`Base URL: ${BASE_URL}`);
console.log(`Account ID: ${TEST_ACCOUNT_ID}`);
console.log(`Number of test runs: ${NUM_TESTS}\n`);

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime.bigint();
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        
        try {
          const jsonData = JSON.parse(data);
          resolve({
            duration,
            statusCode: res.statusCode,
            dataSize: data.length,
            roomCount: jsonData.rooms ? jsonData.rooms.length : 0,
            memoryCount: jsonData.rooms ? 
              jsonData.rooms.reduce((total, room) => total + (room.memories ? room.memories.length : 0), 0) : 0,
            success: res.statusCode === 200 && !jsonData.error
          });
        } catch (parseError) {
          resolve({
            duration,
            statusCode: res.statusCode,
            dataSize: data.length,
            roomCount: 0,
            memoryCount: 0,
            success: false,
            error: 'JSON parse error'
          });
        }
      });
    });
    
    req.on('error', (error) => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000;
      reject({ error: error.message, duration });
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject({ error: 'Request timeout', duration: 30000 });
    });
  });
}

async function runPerformanceTest() {
  const url = `${BASE_URL}/api/room/get?account_id=${TEST_ACCOUNT_ID}`;
  const results = [];
  
  console.log('Running performance tests...\n');
  
  for (let i = 1; i <= NUM_TESTS; i++) {
    try {
      console.log(`Test ${i}/${NUM_TESTS}...`);
      const result = await makeRequest(url);
      results.push(result);
      
      console.log(`  ✅ ${result.duration.toFixed(2)}ms | ${result.roomCount} rooms | ${result.memoryCount} memories | ${(result.dataSize/1024).toFixed(1)}KB`);
      
      // Small delay between requests
      if (i < NUM_TESTS) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.error} (${error.duration.toFixed(2)}ms)`);
      results.push({ ...error, success: false });
    }
  }
  
  // Calculate statistics
  const successfulResults = results.filter(r => r.success);
  
  if (successfulResults.length === 0) {
    console.log('\n❌ All tests failed!');
    return;
  }
  
  const durations = successfulResults.map(r => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const avgRooms = successfulResults.reduce((a, b) => a + b.roomCount, 0) / successfulResults.length;
  const avgMemories = successfulResults.reduce((a, b) => a + b.memoryCount, 0) / successfulResults.length;
  const avgDataSize = successfulResults.reduce((a, b) => a + b.dataSize, 0) / successfulResults.length;
  
  console.log('\n📊 PERFORMANCE RESULTS');
  console.log('======================');
  console.log(`Successful requests: ${successfulResults.length}/${NUM_TESTS}`);
  console.log(`Average response time: ${avgDuration.toFixed(2)}ms`);
  console.log(`Fastest response: ${minDuration.toFixed(2)}ms`);
  console.log(`Slowest response: ${maxDuration.toFixed(2)}ms`);
  console.log(`Average rooms loaded: ${avgRooms.toFixed(1)}`);
  console.log(`Average memories loaded: ${avgMemories.toFixed(1)}`);
  console.log(`Average data size: ${(avgDataSize/1024).toFixed(1)}KB`);
  
  // Performance assessment
  console.log('\n🎯 PERFORMANCE ASSESSMENT');
  console.log('==========================');
  if (avgDuration < 1000) {
    console.log('🟢 EXCELLENT: Sub-1-second response time!');
  } else if (avgDuration < 3000) {
    console.log('🟡 GOOD: Reasonable response time');
  } else if (avgDuration < 10000) {
    console.log('🟠 SLOW: Could use optimization');
  } else {
    console.log('🔴 VERY SLOW: Needs immediate attention');
  }
  
  // Expected vs actual
  console.log('\n📈 IMPROVEMENT ANALYSIS');
  console.log('========================');
  console.log('Expected after index optimization:');
  console.log('  • Response time: <1000ms (sub-1-second)');
  console.log('  • Index usage: Direct lookups instead of table scans');
  console.log('  • Memory efficiency: Targeted record retrieval');
  console.log(`\nActual results:`);
  console.log(`  • Response time: ${avgDuration.toFixed(2)}ms`);
  console.log(`  • Success rate: ${(successfulResults.length/NUM_TESTS*100).toFixed(1)}%`);
  console.log(`  • Data efficiency: ${(avgMemories/avgRooms).toFixed(1)} memories per room`);
}

// Run the test
runPerformanceTest().catch(console.error);
