import '@testing-library/jest-dom';
require('jest-fetch-mock').enableMocks();

(<any>window).URL.createObjectURL = function() {};