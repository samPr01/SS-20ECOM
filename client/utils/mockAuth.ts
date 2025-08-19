// Mock authentication utility for when backend is not available
interface MockUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Mock user storage
const mockUsers: MockUser[] = [];

// Mock authentication functions
export const mockAuth = {
  // Register a new user
  register: async (userData: { name: string; email: string; password: string }): Promise<{ user: MockUser }> => {
    console.log('Mock register called with:', userData);
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: MockUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    console.log('New user created:', newUser);
    console.log('Total users:', mockUsers.length);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { user: newUser };
  },

  // Login user
  login: async (credentials: { email: string; password: string }): Promise<{ user: MockUser }> => {
    // Find user by email
    const user = mockUsers.find(user => user.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In a real app, you'd verify the password here
    // For mock purposes, we'll accept any password
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { user };
  },

  // Get all users (for admin)
  getUsers: async (): Promise<{ users: MockUser[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { users: [...mockUsers] };
  },
};

// Enhanced fetch function that uses mock auth for development
export const authFetch = async (url: string, options: RequestInit = {}) => {
  // For development, always use mock authentication
  console.log('Using mock authentication for:', url);
  
  const { method, body } = options;
  const data = body ? JSON.parse(body as string) : {};

  if (url.includes('/api/auth/register') && method === 'POST') {
    console.log('Handling register request with data:', data);
    try {
      const result = await mockAuth.register(data);
      console.log('Register successful:', result);
      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.log('Register failed:', error);
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Registration failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (url.includes('/api/auth/login') && method === 'POST') {
    try {
      const result = await mockAuth.login(data);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Login failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (url.includes('/api/auth/users') && method === 'GET') {
    try {
      const result = await mockAuth.getUsers();
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // For other endpoints, return a mock response
  return new Response(JSON.stringify({ error: 'Endpoint not implemented in mock mode' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
};
