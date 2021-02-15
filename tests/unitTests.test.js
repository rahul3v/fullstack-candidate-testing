//import React from 'react';
import {numFormat,sortFun} from '../pages/index'

test('Number is formating', () => {
    expect(numFormat(134567)).toBe("134,567");
    expect(numFormat(567)).toBe("567");
});

test('Sorting the string object ascending order', () => {
    expect(sortFun([{name:"ab"},{name:"aa"},{name:"bc"}],"asc")).toEqual([ { name: 'aa' }, { name: 'ab' }, { name: 'bc' } ]);
});

test('Sorting the string object descending order', () => {
    expect(sortFun([{name:"ab"},{name:"aa"},{name:"bc"}],"des")).toEqual([ { name: 'bc' }, { name: 'ab' }, { name: 'aa' } ]);
});