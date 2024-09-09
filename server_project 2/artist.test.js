const request = require('supertest');
const express = require('express');
const router = require('./router'); 

const app = express();
app.use(express.json()); 
app.use(router);

jest.mock('../utils/util', () => ({
  isDataFileNotPresent: jest.fn(),
  findHighestId: jest.fn(),
  readFileAsJsonString: jest.fn(),
  updateArtworkData: jest.fn()
}));

const { readFileAsJsonString, updateArtworkData, findHighestId, isDataFileNotPresent } = require('../utils/util');


describe('GET /get-all-artist', () => {
    it('should return all artists data if reading is successful', async () => {
      const artistsData = [{ id: 1, name: 'Artist One' }];
      readFileAsJsonString.mockResolvedValue(JSON.stringify(artistsData));
  
      const response = await request(app).get('/get-all-artist');
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(artistsData);
      expect(readFileAsJsonString).toHaveBeenCalled();
    });
  
    it('should return an error message if reading fails', async () => {
      readFileAsJsonString.mockResolvedValue(false);
  
      const response = await request(app).get('/get-all-artist');
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('Error reading the data');
    });
  });

  
  describe('POST /new-artist', () => {
    const newArtist = { name: 'New Artist', birth: '1990', death: '2050' };
    const artistsData = [{ id: 1, name: 'Artist One' }];
  
    beforeEach(() => {
      isDataFileNotPresent.mockReturnValue(false);
      findHighestId.mockReturnValue(1);
    });
  
    it('should add a new artist and return a success message', async () => {
      updateArtworkData.mockImplementation(() => Promise.resolve());
  
      const response = await request(app)
        .post('/new-artist')
        .send(newArtist);
  
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Added a new artist in database');
      expect(updateArtworkData).toHaveBeenCalled();
    });
  
    it('should return an error message if the update fails', async () => {
      updateArtworkData.mockImplementation(() => {
        throw new Error('Update failed');
      });
  
      const response = await request(app)
        .post('/new-artist')
        .send(newArtist);
  
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Error, the artist data did not send and save');
    });
  
    it('should return an error message if data file is not present', async () => {
      isDataFileNotPresent.mockReturnValue(true);
  
      const response = await request(app)
        .post('/new-artist')
        .send(newArtist);
  
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Data file not present');
    });
  });
  