import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AndroidDriver from '../../..';
import sampleApps from 'sample-apps';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';

chai.should();
chai.use(chaiAsPromised);

let driver;
let defaultCaps = {
  app: sampleApps('ApiDemos-debug'),
  deviceName: 'Android',
  platformName: 'Android'
};
let assertSource = async (source) => {
  source.should.exist;
  let dom = new DOMParser().parseFromString(source);
  let nodes = xpath.select('//android.widget.TextView[@content-desc="App"]', dom);
  nodes.length.should.equal(1);
};

describe('apidemo - source', function () {
  before(async () => {
    driver = new AndroidDriver();
    await driver.createSession(defaultCaps);
  });
  after(async () => {
    await driver.deleteSession();
  });
  it('should return the page source', async () => {
    let source = await driver.getPageSource();
    await assertSource(source);
  });
  it('should get less source when compression is enabled', async () => {
    let getSourceWithoutCompression = async () => {
      await driver.updateSettings({'ignoreUnimportantViews': false});
      return await driver.getPageSource();
    };
    let getSourceWithCompression = async () => {
      await driver.updateSettings({"ignoreUnimportantViews": true});
      return await driver.getPageSource();
    };
    let sourceWithoutCompression = await getSourceWithoutCompression();
    let sourceWithCompression = await getSourceWithCompression();
    sourceWithoutCompression.length.should.be.greaterThan(sourceWithCompression.length);
  });
});
