import { MapApplicationPage } from './app.po';

describe('map-application App', () => {
  let page: MapApplicationPage;

  beforeEach(() => {
    page = new MapApplicationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
