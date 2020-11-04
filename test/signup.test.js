const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../app');

describe('Unit testing the /signup route', function() {

    it('should return OK status', function() {
      return request(app)
        .get('/signup')
        .then(function(response){
            assert.strictEqual(response.status, 404)
        })
    });

 

});
