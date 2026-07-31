DELETE FROM "resumes" a USING "resumes" b
WHERE a.id < b.id AND a.user_id = b.user_id;

ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_key" UNIQUE("user_id");