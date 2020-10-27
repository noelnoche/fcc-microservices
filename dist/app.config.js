"use strict";

var appEnv = process.env.NODE_ENV;
var creds = {};
var server = {};
var endpoints = {};
creds.CX_ID = process.env.CX_ID;
creds.CSE_KEY = process.env.CSE_KEY;

if (appEnv === 'production') {
  server.port = process.env.PORT;
  server.ip = process.env.IP;
  endpoints.MONGO_URI = process.env.MONGO_URI;
  endpoints.SHORT_URI = 'https://ncom.herokuapp.com/url-shortener/';
} else {
  require('dotenv').config();

  server.port = 3000;
  server.ip = '0.0.0.0';
  endpoints.MONGO_URI = 'mongodb://localhost:27017';
  endpoints.SHORT_URI = 'http://localhost:3000/url-shortener/';
}

module.exports = {
  creds: creds,
  server: server,
  endpoints: endpoints
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAuY29uZmlnLmpzIl0sIm5hbWVzIjpbImFwcEVudiIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsImNyZWRzIiwic2VydmVyIiwiZW5kcG9pbnRzIiwiQ1hfSUQiLCJDU0VfS0VZIiwicG9ydCIsIlBPUlQiLCJpcCIsIklQIiwiTU9OR09fVVJJIiwiU0hPUlRfVVJJIiwicmVxdWlyZSIsImNvbmZpZyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsTUFBTSxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBM0I7QUFDQSxJQUFNQyxLQUFLLEdBQUcsRUFBZDtBQUNBLElBQU1DLE1BQU0sR0FBRyxFQUFmO0FBQ0EsSUFBTUMsU0FBUyxHQUFHLEVBQWxCO0FBQ0FGLEtBQUssQ0FBQ0csS0FBTixHQUFjTixPQUFPLENBQUNDLEdBQVIsQ0FBWUssS0FBMUI7QUFDQUgsS0FBSyxDQUFDSSxPQUFOLEdBQWdCUCxPQUFPLENBQUNDLEdBQVIsQ0FBWU0sT0FBNUI7O0FBRUEsSUFBSVIsTUFBTSxLQUFLLFlBQWYsRUFBNkI7QUFDM0JLLEVBQUFBLE1BQU0sQ0FBQ0ksSUFBUCxHQUFjUixPQUFPLENBQUNDLEdBQVIsQ0FBWVEsSUFBMUI7QUFDQUwsRUFBQUEsTUFBTSxDQUFDTSxFQUFQLEdBQVlWLE9BQU8sQ0FBQ0MsR0FBUixDQUFZVSxFQUF4QjtBQUNBTixFQUFBQSxTQUFTLENBQUNPLFNBQVYsR0FBc0JaLE9BQU8sQ0FBQ0MsR0FBUixDQUFZVyxTQUFsQztBQUNBUCxFQUFBQSxTQUFTLENBQUNRLFNBQVYsR0FBc0IsMkNBQXRCO0FBQ0QsQ0FMRCxNQU1LO0FBQ0hDLEVBQUFBLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0JDLE1BQWxCOztBQUNBWCxFQUFBQSxNQUFNLENBQUNJLElBQVAsR0FBYyxJQUFkO0FBQ0FKLEVBQUFBLE1BQU0sQ0FBQ00sRUFBUCxHQUFZLFNBQVo7QUFDQUwsRUFBQUEsU0FBUyxDQUFDTyxTQUFWLEdBQXNCLDJCQUF0QjtBQUNBUCxFQUFBQSxTQUFTLENBQUNRLFNBQVYsR0FBc0Isc0NBQXRCO0FBQ0Q7O0FBRURHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmZCxFQUFBQSxLQUFLLEVBQUxBLEtBRGU7QUFFZkMsRUFBQUEsTUFBTSxFQUFOQSxNQUZlO0FBR2ZDLEVBQUFBLFNBQVMsRUFBVEE7QUFIZSxDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGFwcEVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WO1xuY29uc3QgY3JlZHMgPSB7fTtcbmNvbnN0IHNlcnZlciA9IHt9O1xuY29uc3QgZW5kcG9pbnRzID0ge307XG5jcmVkcy5DWF9JRCA9IHByb2Nlc3MuZW52LkNYX0lEO1xuY3JlZHMuQ1NFX0tFWSA9IHByb2Nlc3MuZW52LkNTRV9LRVk7XG5cbmlmIChhcHBFbnYgPT09ICdwcm9kdWN0aW9uJykge1xuICBzZXJ2ZXIucG9ydCA9IHByb2Nlc3MuZW52LlBPUlQ7XG4gIHNlcnZlci5pcCA9IHByb2Nlc3MuZW52LklQO1xuICBlbmRwb2ludHMuTU9OR09fVVJJID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJJO1xuICBlbmRwb2ludHMuU0hPUlRfVVJJID0gJ2h0dHBzOi8vbmNvbS5oZXJva3VhcHAuY29tL3VybC1zaG9ydGVuZXIvJztcbn1cbmVsc2Uge1xuICByZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcbiAgc2VydmVyLnBvcnQgPSAzMDAwO1xuICBzZXJ2ZXIuaXAgPSAnMC4wLjAuMCc7XG4gIGVuZHBvaW50cy5NT05HT19VUkkgPSAnbW9uZ29kYjovL2xvY2FsaG9zdDoyNzAxNyc7XG4gIGVuZHBvaW50cy5TSE9SVF9VUkkgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwL3VybC1zaG9ydGVuZXIvJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWRzLFxuICBzZXJ2ZXIsXG4gIGVuZHBvaW50c1xufVxuIl19