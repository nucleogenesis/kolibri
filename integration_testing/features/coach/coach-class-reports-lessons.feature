Feature: Lessons subtab
  Coach needs to be able to see the lesson report details with the progress and score for each learner

  Background:
    Given I am logged in as a coach
      And I am on *Coach - '<class>' > Reports > Lessons* subtab
      And there is a <lesson> with a <resource> and <exercise> assigned to <class>

    Scenario: Review lesson reports
      When I click on lesson <lesson>
      Then I see the *Report* tab and the table with each lesson resource
        And I see the *Progress* and *Average time spent* columns for each resource

    Scenario: Review resource progress *Report* subtab
      When I click on a resource <resource>
      Then I see the table of learners
        And I see the summary icons (learners who completed, started, not started, and struggling)
        And I see engagement data (status, time spent, group, last activity) for each learner assigned the resource

    Scenario: Review progress from *Learners* subtab
        Given that I am on a lesson <lesson> details page
          When I click on the *Learners* subtab
          Then I see the table with learners who are assigned that lesson
            And I see the columns for progress on the overall lesson resources

    Scenario: Review exercise attempt report
      Given that I am on *Coach - '<class>' > Reports > Lessons > '<lesson>' > Learners* subtab
        When I click on the <learner> name
        Then I see the table with resources in the lesson <lesson>
          And I see columns with <learner> progress and time spent on each exercise or resource in the <lesson>
        When I click on <exercise> exercise
        Then I see the attempt report of the <learner> for each question in the <exercise>

  Scenario: Learner has not started a resource
    When a learner has not started <resource> or <exercise>
    Then the learner's *Progress* column states *Not started*

  Scenario: Learner has started a resource
    When a learner has started an <resource> or <exercise>
    Then the learner's *Progress* column states *Started*

  Scenario: Learner has completed a resource
    When a learner has completed <resource> or <exercise>
    Then their *Progress* column states *Completed*

  Scenario: Learner needs help with a resource
    When a learner has given 2 wrong answers in the <exercise>
      # Clarify conditions for *Needs help*
    Then their *Progress* column states *Needs help*

  Scenario: The resource report page viewed by groups when no groups available
    Given that I am on the <resource> report page
      And the <classroom> has no learner groups
      And the <lesson> has been assigned to the entire <classroom>
      And there is at least one <classroom> learner
    When I click *View by groups* checkbox
    Then I can see *Ungrouped learners* section containing all <lesson> learners

  Scenario: The resource report page viewed by groups when the <lesson> assigned to the entire <classroom>
    Given that I am on the <resource> report page
      And the <classroom> has at least one learner group
      And there is at least one <classroom> learner in this group and at least one <classroom> learner with no group assigned
      And the <lesson> has been assigned to the entire <classroom>
    When I click *View by groups* checkbox
    Then I see <classroom> learners grouped by <lesson> groups
      And I see <classroom> learners with no groups assigned in *Ungrouped learners* section

  Scenario: Empty groups on the resource report page viewed by groups when the <lesson> assigned to the entire <classroom>
    Given that I am on the <resource> report page
      And the <classroom> has at least one empty learners group
      And the <lesson> has been assigned to the entire <classroom>
    When I click *View by groups* checkbox
    Then I see the empty group

  Scenario: The resource report page viewed by groups when the <lesson> assigned to a group
    Given that I am on the <resource> report page
      And the <classroom> has at least one learner group
      And there is at least one <classroom> learner in this group and at least one <classroom> learner with no groups assigned
      And the <lesson> has been assigned to this group
    When I click *View by groups* checkbox
    Then I see <classroom> learners grouped by <lesson> groups
      And I cannot see <classroom> learners with no groups assigned

  Scenario: Empty groups on the resource report page viewed by groups when the <lesson> assigned to a group
    Given that I am on the <resource> report page
      And the <classroom> has at least two empty learners groups
      And the <lesson> has been assigned to one of them
    When I click *View by groups* checkbox
    Then I see the empty group which has been assigned to the <lesson>
      And I cannot see the empty group which has not been assigned to the <lesson>

  Scenario: View resource preview
    Given that I am on the <resource> report page
    When I click *Preview* button
    Then I can see the <resource> preview
    When I click the back arrow in the immersive toolbar
    Then I am returned to the <resource> report page

  Scenario: View resource preview when <classroom> learners grouped by <lesson> groups
    Given that I am on the <resource> report page
      And learners are grouped by <lesson> groups
    When I click *Preview* button
    Then I can see the <resource> preview
    When I click the back arrow in the immersive toolbar
    Then I am returned to the <resource> report page
      And *View by groups* checkbox stays checked
      And I can see learners grouped by <lesson> groups

Examples:
| class     | learner  | lesson         | exercise   | resource                 |
| My class  | Marc G.  | Basic division | Divide up! | One digit division video |
