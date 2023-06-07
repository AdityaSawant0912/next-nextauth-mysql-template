import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { v4 as uuidv4 } from 'uuid';
import executeQuery from "@/lib/db";
import { hash, compare } from 'bcryptjs';

export default async function handler(req, res) {
  const method = req.method;
  
  const session = await getServerSession(req, res, authOptions);
  
  switch (method) {
    case 'GET': // Get user data for session user
      if (session) return res.status(307).redirect(`/api/user/${session.user.userId}`);
      return req.status(308).redirect('/api/auth/signin');

    case 'POST': // Create new user
      if (session) return res.status(307).redirect(`/api/user/${session.user.userId}`);
      const { email, password, firstName, lastName } = req.body;
      const userId = uuidv4(); 
      const userHash = await hash(password, 10);
      const userRole = 2;

      var user_auth_data = await executeQuery({
        query: "INSERT INTO user_auth(user_id, user_email, user_hash, user_role_id) VALUES (?,?,?,?)",
        values: [userId, email, userHash, userRole]
      })
      if (user_auth_data.error.code == 'ER_DUP_ENTRY') return res.status(409).json({ message: 'User already exists' })
      
      var user_acc_data = await executeQuery({
        query: "INSERT INTO user_account(user_id, user_first_name, user_last_name) VALUES (?,?,?);",
        values: [userId,  firstName, lastName]
      })
      if(user_auth_data.affectedRows <= 0 || user_acc_data.affectedRows <= 0) {
        var user_auth_data_del = await executeQuery({
          query: "DELETE FROM user_auth WHERE user_id = ?",
          values: [userId]
        })
        var user_acc_data_del = await executeQuery({
          query: "DELETE FROM user_account WHERE user_id = ?",
          values: [userId]
        })
        return res.status(500).json({ message: 'Something went wrong' })
      }
      return res.status(201).json({ message: 'User created successfully', user: { userId, email, firstName, lastName } });
    
    case 'PUT': // Reset password for session user
      const { oldPassword, newPassword } = req.body;
      const newHash = await hash(newPassword, 10);
      const oldHash = await executeQuery({
        query: "SELECT user_hash FROM user_auth WHERE user_id = ?",
        values: [session.user.user_id]
      })
      if (oldHash.length < 0) return res.status(404).json({ message: 'User not found' })
      if (! await compare(oldPassword, oldHash[0].user_hash)) return res.status(401).json({ message: 'Unauthorized' })
      var data = await executeQuery({
        query: "UPDATE user_auth SET user_hash = ? WHERE user_id = ?",
        values: [newHash, session.user.user_id]
      })
      if(data.affectedRows < 0) return res.status(500).json({ message: 'Something went wrong' });
      return res.status(201).json({ message: 'Password updated successfully' });
    
    case 'DELETE': // Delete session user
      if(!session) return res.status(401).json({ message: 'Unauthorized' })
      return res.status(307).redirect(`/api/user/${session.user.userId}`)
    
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}
