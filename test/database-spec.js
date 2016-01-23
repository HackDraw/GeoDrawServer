var request = require('supertest');
var expect = require('chai').expect;
var rewire = require('rewire');

var db = require('../models/database.js');
