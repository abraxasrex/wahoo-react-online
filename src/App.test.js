import React from 'react';
import { expect } from 'chai';
import {before, after} from 'mocha';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


import Oofda from './Oofda';
import GameView from './view_components/GameView';

Enzyme.configure({ adapter: new Adapter() });

var clock;

before(function () {
  clock = sinon.useFakeTimers();
});
after(function () {
  clock.restore();
});

describe('<Oofda />', () => {
  it('renders one  <GameView /> components', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(GameView)).to.have.lengthOf(1);
  });

  it('shows 6 available slots after selecting a piece from Player 1', () => {

  });

  it('changes player after first move', () => {

  });

  it('changes player after first move', () => {

  });

//   it('renders an `.icon-star`', () => {
//     const wrapper = shallow(<MyComponent />);
//     expect(wrapper.find('.icon-star')).to.have.lengthOf(1);
//   });

//   it('renders children when passed in', () => {
//     const wrapper = shallow((
//       <MyComponent>
//         <div className="unique" />
//       </MyComponent>
//     ));
//     expect(wrapper.contains(<div className="unique" />)).to.equal(true);
//   });

//   it('simulates click events', () => {
//     const onButtonClick = sinon.spy();
//     const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
//     wrapper.find('button').simulate('click');
//     expect(onButtonClick).to.have.property('callCount', 1);
//   });
});