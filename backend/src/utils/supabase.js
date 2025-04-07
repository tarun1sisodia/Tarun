const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Register a new user
const registerUser = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          bloodType: userData.bloodType
        }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase registration error:', error);
    throw error;
  }
};

// Login a user
const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase login error:', error);
    throw error;
  }
};

// Reset password
const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase password reset error:', error);
    throw error;
  }
};

// Get user by token
const getUserByToken = async (token) => {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Supabase get user error:', error);
    throw error;
  }
};

module.exports = {
  supabase,
  registerUser,
  loginUser,
  resetPassword,
  getUserByToken
};
