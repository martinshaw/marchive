/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: OnboardingIndexPage.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import { Button, Card, H1, H3 } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import Carousel from 'better-react-carousel';
import { breakpoints } from 'common-types/src/styling/breakpoints';

import './index.scss';

const OnboardingIndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding">
      <div className="onboarding__heading">Marchive</div>
      <div className="onboarding__subheading">
        The Ultimate Information, News and Media Archiver and Aggregator
      </div>

      <div className="onboarding__features">
        <Carousel
          gap={10}
          loop
          responsiveLayout={[
            {
              cols: 1,
              rows: 1,
            },
            {
              breakpoint: breakpoints.extraLarge,
              cols: 2,
              rows: 2,
            },
            {
              breakpoint: breakpoints['2xl'],
              cols: 3,
              rows: 2,
            },
            {
              breakpoint: breakpoints['5xl'],
              cols: 4,
              rows: 2,
            },
          ]}
        >
          <Carousel.Item>
            <div className="onboarding__features__feature">
              <b>Archive your favorite blogs</b>
              <p>Ensure the latest posts are kept to read forever</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="onboarding__features__feature">
              <b>Record what is going on in the news</b>
              <p>Save time checking your favorite sites</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="onboarding__features__feature">
              <b>Store the world's knowledge from Wikipedia</b>
              <p>See how events change over time with weekly saves</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="onboarding__features__feature">
              <b>Download, listen and watch your podcast feeds</b>
              <p>Use our elegantly designed player</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="onboarding__features__feature">
              <b>Quickly take a full-size screenshot of a webpage</b>
              <p>Without ads, mess and glitches in seconds</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="onboarding__features__feature">
              <b>Capture the Google results for an interested subject</b>
              <p>Keep track of a topic's relevance and word frequency</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="onboarding__features__feature">
              <b>Keep track of a product listing's price and availability</b>
              <p>Coming soon for Amazon, eBay, etc...</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="onboarding__features__feature">
              <b>Scrape all of the images and videos from a web album</b>
              <p>With one click, then use our gallery interface</p>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      <div className="onboarding__buttons">
        <Button
          large
          rightIcon="arrow-right"
          onClick={() => {
            navigate('/sources/create');
          }}
        >
          Add Your First Source of Information
        </Button>
      </div>
    </div>
  );
};

export default OnboardingIndexPage;
