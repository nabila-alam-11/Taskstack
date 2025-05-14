const express = require("express");
const mongoose = require("mongoose");

const app = express();

const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();
