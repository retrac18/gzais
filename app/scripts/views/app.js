/*global define*/
define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function($, _, Backbone, JST) {
  'use strict';

  var AppView = Backbone.View.extend({

    el: $('#app'),

    subViews: {

    },

    template: JST['app/scripts/templates/app.ejs'],

    // Sub Templates
    loginTemplate: JST['app/scripts/templates/login-form.ejs'],
    mainTemplate: JST['app/scripts/templates/app-main.ejs'],

    initialize: function() {

      var self = this;

      // Setup data bindings
      self.listenTo(self.model, 'change:user', self.render);
      self.listenTo(self.model, 'change:currentContent', self.renderCurrentContent);

      self.render();

    },

    events: {
      'submit form.login-form': 'doLogin',
      'click a.logout': 'doLogOut'
    },

    render: function() {

      var self = this;

      // render app view
      self.$el.html(self.template({
        model: self.model
      }));

      // set containerDiv var to point to the <div class="container"></div>
      self.model.set('containerDiv', self.$el.find('.main > .container')[0]);

      if (self.model.get('user')) {

        // logged in
        $(self.model.get('containerDiv')).html(self.mainTemplate());
        // set contentSectionDiv var to point to the <div class="content-section"></div>
        self.model.set('contentSectionDiv', $(self.model.get('containerDiv')).find('.content-section')[0]);
        // redirect to /employees
        window.App.router.navigate(self.model.get('baseUrl'), {
          trigger: true
        });

      } else {

        // if model.user is undefined then we're not logged in
        $(self.model.get('containerDiv')).html(self.loginTemplate());

      }

      // .content-section

      return self;

    },

    renderCurrentContent: function() {

      var self = this,
          currentContent = self.model.get('currentContent'),
          contentSectionDiv = self.model.get('contentSectionDiv');

      // re-delegate events on the current view
      currentContent.delegateEvents();

      $(contentSectionDiv)
      .hide()
      .empty()
      .html(currentContent.render().el).fadeIn("slow");

      // handle .main-nav tabs
      self.handleMainNav();

    },

    handleMainNav: function() {

      // removed currently active li element
      $('.main-nav > li.active').removeClass('active');

      // check pathname
      var pathName = Backbone.history.location.pathname;

      if (pathName.match(/^\/assets/)) {
        return $('.main-nav > li.assets').addClass('active');
      }

      if (pathName.match(/^\/employees/)) {
        return $('.main-nav > li.employees').addClass('active');
      }

      if (pathName.match(/^\/inventory-reports/)) {
        return $('.main-nav > li.reports').addClass('active');
      }

    },

    doLogin: function(e) {

      e.preventDefault();

      var self = this,
        form = e.currentTarget,
        emailField = form.email,
        passwordField = form.password;

      /**
       * Login Form Validation
       **/
      if (!emailField.value.trim().match(/^[a-z0-9._%\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/)) {

        $(emailField).parent().addClass('has-error');
        return emailField.focus();

      }

      $(emailField).parent().removeClass('has-error').blur();

      if (passwordField.value.trim().length < 6) {

        $(passwordField).parent().addClass('has-error');
        return passwordField.focus();

      }

      $(passwordField).parent().removeClass('has-error').blur();

      // $('input, button').prop('disabled', true);
      // $('.btns').addClass('loading');

      if (emailField.value === 'admin@admin.com' && passwordField.value === 'admin123') {

        self.model.set('user', {
          email: emailField.value,
          password: passwordField.value
        });

        var user = self.model.get('user');
        window.localStorage.setItem('user', JSON.stringify(user));

      }

    },

    doLogOut: function(e) {
      e.preventDefault();

      if (this.model.get('user')) {
        this.model.set('user', null);
        window.localStorage.removeItem('user');
        window.App.router.navigate('/', {trigger: true});
      }

    }

  });

  return AppView;
});
