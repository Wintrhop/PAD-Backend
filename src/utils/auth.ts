import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export interface RequestWithUserId extends Request {
  userId?: string
}

export const auth = (req: RequestWithUserId, res: Response, next: NextFunction): any => {
  const {authorization}: any | undefined = req.headers
  if (!authorization){
    throw new Error("Session expired");
  }
  const [_,token] = authorization.split(" ");

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'No token provided'
    })
  }

  try {
    const { id }: any = jwt.verify(token, process.env.SECRET_KEY as any)
    req.userId = id
  } catch (error: any) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid token'
    })
  }

  next()
}