var request = require('supertest');
var expect = require('chai').expect;
var rewire = require('rewire');
var app = rewire('../app');

describe('Routing', function() {
    it("Should do something", function(done) {
        request(app).get('/').expect(200).end(done);
    });

    describe('/paths', function() {
        beforeEach(function() {
            this.paths = [
                {
                    "color": "#969696",
                    "points": [
                        {
                            "latitude": -90.555,
                            "longitude": 109.2324
                        },
                        {
                            "latitude": 102.2224,
                            "longitude": -192.2934
                        },
                        {
                            "latitude": 103.2224,
                            "longitude": -182.2934
                        }
                    ]
                },
                {
                    "color": "#765432",
                    "points": [
                        {
                            "latitude": 90.555,
                            "longitude": -109.2324
                        },
                        {
                            "latitude": -102.2224,
                            "longitude": 192.2934
                        }
                    ]
                },
            ];

            app.__set__('paths', this.paths);
        });

        it("GET should fail (404)", function(done) {
            request(app).get('/paths').expect(404).end(done);
        });

        it("POST should create new resource (201)", function(done) {
            request(app).post('/paths')
                .send({
                    "color": "#123456",
                    "points": [
                        {
                            "latitude": 108.2456,
                            "longitude": 123.1456
                        },
                        {
                            "latitude": 98.2456,
                            "longitude": 122.1456
                        }
                    ]
                })
                .expect(201)
                .end(done);
        });

        it("PUT should fail (404)", function(done) {
            request(app).put('/paths').expect(404).end(done);
        });

        it("DELETE should fail (404)", function(done) {
            request(app).delete('/paths').expect(404).end(done);
        });
    });
});
