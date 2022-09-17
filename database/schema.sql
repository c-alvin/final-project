set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."reviews" (
	"commentId" serial NOT NULL,
	"userId" int NOT NULL,
	"content" TEXT NOT NULL,
	"gameId" int NOT NULL,
	"ratingValue" int NOT NULL,
	CONSTRAINT "reviews_pk" PRIMARY KEY ("commentId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"hashedPassword" TEXT NOT NULL,
	"username" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."favorites" (
	"gameId" int NOT NULL,
	"userId" int NOT NULL,
	"favoritedAt" time with time zone NOT NULL
) WITH (
  OIDS=FALSE
);



ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "favorites" ADD CONSTRAINT "favorites_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");
