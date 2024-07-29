import { createUploadthing, type FileRouter } from "uploadthing/next";
import * as zod from 'zod';

const f = createUploadthing({
	errorFormatter: error => {
		return {
			message: error.message,
			zodError:
				error.cause instanceof zod.ZodError ? error.cause.flatten() : null,
		};
	},
});


export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    // @ts-ignore
    async ({ file }) => {
      console.log("file url", file.url);
      return file.url
    }
  ),
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } }).onUploadComplete(
    // @ts-ignore
    async ({ file }) => {
      console.log("file url", file.url);
      return file.url
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
