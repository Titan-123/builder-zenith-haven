const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: null,
    },
    location: {
      raw: { type: String, default: null },
      locations: [{ type: String, default: null }],
    },

    // experience: {
    //   type: String,
    //   default: null,
    // },
    // minExperience: {
    //   type: Number,
    //   default: null,
    // },
    // maxExperience: {
    //   type: Number,
    //   default: null,
    // },

    experience: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      raw: { type: String, default: null },
    },

    // salary: {
    //   type: String,
    //   default: null,
    // },
    // // If you parse structured salary later
    // minSalary: {
    //   type: Number,
    //   default: null,
    // },
    // maxSalary: {
    //   type: Number,
    //   default: null,
    // },

    salary: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      raw: { type: String, default: null },
    },
    datePosted: {
      type: String,
      default: null,
    },
    datePostedISO: {
      type: Date,
      default: null,
    },
    link: {
      type: String,
      unique: true,
      default: null,
    },
    portal: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Onsite", "Hybrid", "Remote"],
      default: "Onsite",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);

