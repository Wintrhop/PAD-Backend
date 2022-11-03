import busboy from "busboy";
import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.STORAGE_NAME,
  api_key: process.env.STORAGE_API_KEY,
  api_secret: process.env.STORAGE_API_SECRET,
});


export const formData = (req: Request, res: Response, next: NextFunction) => {
    let uploadingFile = false
  let uploadingCount = 0

  const done = () => {
    if (uploadingFile) return
    if (uploadingCount > 0) return
    next()
  }

  const bb = busboy({ headers: req.headers })
  req.body = {}

  // Captura de partes que no son un archivo
  bb.on("field", (key, val) => {
    req.body[key] = val
  })

  // Capturas partes que son archivo
  bb.on("file", (key, stream) => {
    uploadingFile = true
    uploadingCount++
    const cloud = cloudinary.uploader.upload_stream(
      { upload_preset: "pad-preset" },
      (err, res) => {
        if (err) throw new Error("Something went wrong!")

        req.body[key] = res?.secure_url
        uploadingFile = false
        uploadingCount--
        done()
      }
    )

    stream.on("data", (data) => {
      cloud.write(data)
    })

    stream.on("end", () => {
      cloud.end()
    })
  })

  bb.on("finish", () => {
    done()
  })

  req.pipe(bb)
};
