import { CutMasterPage } from './app.po';

describe('cut-master App', () => {
  let page: CutMasterPage;

  beforeEach(() => {
    page = new CutMasterPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
