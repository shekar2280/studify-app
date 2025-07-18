import { boolean, integer, json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const USER_TABLE=pgTable('users', {
    id:serial().primaryKey(),
    name:varchar().notNull(),
    email:varchar().notNull(),
    isMember:boolean().default(false),
    createdAt: timestamp().defaultNow()
})

export const STUDY_MATERIAL_TABLE=pgTable('studyMaterial', {
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    courseType:varchar().notNull(),
    topic:varchar().notNull(),
    difficultyLevel:varchar().default('Easy'),
    courseLayout:json(),
    createdBy:varchar().notNull(),
    status:varchar().default('Generating'),
    createdAt: timestamp().defaultNow()
})

export const CHAPTER_NOTES_TABLE = pgTable("chapterNotes", {
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    chapterId: integer().notNull(),
    notes: text(),
    status: varchar().default("Generating"), 
    createdAt: timestamp().defaultNow(),
  });
  

export const STUDY_TYPE_CONTENT_TABLE = pgTable('studyTypeContent',{
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    content:json(),
    type:varchar().notNull(),
    status:varchar().default('Generating'),
    createdAt: timestamp().defaultNow()
}) 


export const USER_COURSE_PROGRESS_TABLE = pgTable("userCourseProgress", {
  id: serial().primaryKey(),
  userId: varchar().notNull(),        
  courseId: varchar().notNull(),      
  notesCompleted: boolean().default(false),
  flashcardsCompleted: boolean().default(false),
  quizCompleted: boolean().default(false),
  qaCompleted: boolean().default(false),
  updatedAt: timestamp().defaultNow(),
});


// export const FRIEND_REQUEST_TABLE = pgTable("friendRequests", {
//   id: serial().primaryKey(),
//   senderId: varchar().notNull(),
//   receiverId: varchar().notNull(),
//   status: varchar().default("pending"), 
//   createdAt: timestamp().defaultNow(),
// });


// export const FRIENDSHIP_TABLE = pgTable("friendships", {
//   id: serial().primaryKey(),
//   user1Id: varchar().notNull(),
//   user2Id: varchar().notNull(),
//   createdAt: timestamp().defaultNow(),
// });
