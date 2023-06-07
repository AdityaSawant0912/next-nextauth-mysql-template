import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import executeQuery from "@/lib/db";

export default async function handler(req, res) {
  const method = req.method;
  const slug = req.query.slug;
  const session = await getServerSession(req, res, authOptions);
  console.log(session);
  
  switch (method) {
    case 'GET': // Get user data for slug user
    
      // Optional: Check if session user can access this user data
      var data = await executeQuery({
        query: "SELECT user_account.* ,user_auth.user_email, user_auth.user_role_id FROM user_account JOIN user_auth ON user_account.user_id = user_auth.user_id WHERE user_auth.user_id = ?",
        values: [slug]
      })
      if (data.length <= 0) return res.status(404).json({ message: 'User not found' })
      return res.status(200).json({ message: 'User found', user: data[0] });

    case 'PUT': // Update user data for slug user
      if(slug !== session?.user?.userId) return res.status(401).json({ message: 'Unauthorized' })
      
      const { firstName, lastName } = req.body;
      console.log(req.body);
      var data = await executeQuery({
        query: "UPDATE user_account SET user_first_name = ?, user_last_name = ? WHERE user_id = ?",
        values: [firstName, lastName, session.user.userId]
      })
      if (data.affectedRows < 0) return res.status(500).json({ message: 'Something went wrong' });
      return res.status(201).json({ message: 'User updated successfully' });
      
    case 'DELETE': // Delete slug user  NOT IMPLEMENTED
      if(slug !== session.user.userId) return res.status(401).json({ message: 'Unauthorized' })
      
      return res.status(501).json({ message: 'Not implemented' })
      
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}
