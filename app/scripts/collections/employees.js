/*global define*/

define([
    'underscore',
    'backbone',
    'models/employee'
], function (_, Backbone, EmployeeModel) {
    'use strict';

    var EmployeesCollection = Backbone.Collection.extend({
        model: EmployeeModel,
        url: '/employees.json',
    });

    return EmployeesCollection;
});