// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interface/IProposal.sol";

library ProposalMapping {
    // Iterable mapping from uint to uint;
    struct Map {
        uint[] keys;
        mapping(uint => IProposal.ProposalInfo) proposal;
        mapping(uint => uint) indexOf;
        mapping(uint => bool) inserted;
    }

    function get(Map storage map, uint key) public view returns (IProposal.ProposalInfo memory) {
        return map.proposal[key];
    }

    function getKeyAtIndex(Map storage map, uint index) public view returns (uint) {
        return map.keys[index];
    }

    function size(Map storage map) public view returns (uint) {
        return map.keys.length;
    }

    function set(Map storage map, uint key, IProposal.ProposalInfo memory val) public {
        // if (map.inserted[key]) {
        //     map.proposal[key] = val;
        // } else {
        //     map.inserted[key] = true;
        //     map.proposal[key] = val;
        //     map.indexOf[key] = map.keys.length;
        //     map.keys.push(key);
        // }
    }

    function remove(Map storage map, uint key) public {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.proposal[key];

        uint index = map.indexOf[key];
        uint lastKey = map.keys[map.keys.length - 1];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

        map.keys[index] = lastKey;
        map.keys.pop();
    }
}
