var expect = require('chai').expect;

var Path = require('../models/path');
var Point = require('../models/point');
var Screen = require('../models/screen');

describe('Models', function() {
    describe('Point', function() {
        it('should create a new Point', function() {
            var point = new Point(-99.123, 99.123);

            expect(point).to.deep.equal({
                x: -99.123,
                y: 99.123
            });
        });
    });

    describe('Path', function() {
        it('should create a new Path', function() {
            var path = new Path("#FFF777", [
                    new Point(-99.123, 99.123),
                    new Point(99.123, -99.123),
                    new Point(1, 1)
                ]
            );

            expect(path).to.have.all.keys('color', 'points');
            expect(path).to.have.deep.property('color', "#FFF777");
            expect(path.points).to.deep.equal([
                    {
                        x: -99.123,
                        y: 99.123
                    },
                    {
                        x: 99.123,
                        y: -99.123
                    },
                    {
                        x: 1,
                        y: 1
                    }
            ]);
        });
    });

    describe('Screen', function() {
        it('should create a new Screen', function() {
            var startPoint = new Point(-918, 192);
            var endPoint = new Point(182,-122);
            var screen = new Screen(startPoint, endPoint);

            expect(screen).to.have.all.keys('startPoint', 'endPoint');
            // expect(screen).to.have.deep.property('startPoint', {
            //     latitude: -918,
            //     longitude: 192
            // });
            // expect(screen).to.have.deep.property('endPoint', {
            //     latitude: 182,
            //     longitude: -122
            // });
        });
    });
});
