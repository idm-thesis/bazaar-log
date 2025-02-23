// What functions to include: background state updates that should run automatically based on state changes
// Do not put player-action-based update functions here
"use client";
import { useCallback, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import rolesList from "@/data/roles.json";
import baseDecisions from "@/data/baseDecisions.json";
import { useDecisionSystem } from "./useDecisionSystem";

export function useGameEffects() {
  const {
    setShowPersonalInfluence,
    setPersonalInfluence,
    number_of_tools,
    number_of_users,
    setShowNumberOfUsers,
    setNumberOfUsers,
    personal_influence,
    information_transmission_speed,
    number_of_collaborators,
    number_of_contributors,
    setToolProductivity,
    setShowToolProductivity,
    role,
    setRole,
    setShowNumberOfCollaborators,
    setShowNumberOfContributors,
    number_of_organizations,
    setShowNumberOfOrganizations,
    // value_generated,
    // setValueGenerated,
    decisions,
    setDecisions,
  } = useGameStore();
  const {formOrganization} = useDecisionSystem();

  // Update role from "Coding Enthusiast" to "Independent Developer", and then to "Open-source Collaborator", based on number_of_tools
  const updateRole0to1 = useCallback(() => {
    const rolesIdx = rolesList.indexOf(role);
    if ((rolesIdx == 0 && number_of_tools > 10)) {
      setRole(rolesList[rolesIdx + 1]);
    }
  },[number_of_tools, role, setRole]);

  useEffect(() => {
    updateRole0to1();
  },[number_of_tools, updateRole0to1]);

  // Update role from "Independent Developer" to "Open-source Collaborator", based on number_of_collaborators
  const updateRole1to2 = useCallback(() => {
    const rolesIdx = rolesList.indexOf(role);
    if ((rolesIdx == 1 && number_of_collaborators > 0)) {
      setRole(rolesList[rolesIdx + 1]);
    }
  },[role, setRole, number_of_collaborators]);

  useEffect(() => {
    updateRole1to2();
  },[number_of_collaborators, updateRole1to2]);

  // Add the form organization option to the decision list, based on number_of_collaborators >= 3
  const addOrganizationOption = useCallback(() => {
    const rolesIdx = rolesList.indexOf(role);
    const newDecision = baseDecisions.find((decision) => decision.id === "formOrganization");
    if (rolesIdx == 2 && number_of_collaborators >= 3 && !decisions.some((decision) => decision.id === "formOrganization")) {
      if (newDecision) {
        const mappedChoices = newDecision.choices.map((choice) => ({
          ...choice,
          effect: () => {
            if (choice.effect === "formOrganization") {
              formOrganization();
            }
          },
        }));  
        setDecisions([
          ...decisions,
          { ...newDecision, choices: mappedChoices },
        ]);
      }
    }
  },[decisions, formOrganization, number_of_collaborators, role, setDecisions]);

  useEffect(() => {
    addOrganizationOption();
  },[number_of_collaborators, addOrganizationOption]);

  // Update personal influence
  const updatePersonalInfluence = useCallback(() => {
    const base = 5;

    const newPersonalInfluence =
      base +
      ((number_of_users * 10) /
        (number_of_contributors > 0 ? (number_of_contributors + 1) : 1)) *
        Math.log(information_transmission_speed + 1);

    setShowPersonalInfluence(newPersonalInfluence > 5);
    setPersonalInfluence(newPersonalInfluence);
  }, [
    information_transmission_speed,
    number_of_contributors,
    number_of_users,
    setPersonalInfluence,
    setShowPersonalInfluence,
  ]);

  useEffect(() => {
    updatePersonalInfluence();
  }, [
    information_transmission_speed,
    number_of_contributors,
    number_of_users,
    updatePersonalInfluence,
  ]);

  // Update number of users
  const updateNumberOfUsers = useCallback(() => {
    const base_growth = 1; // Constant multiplier to balance the rate
    const newNumberOfUsers = Math.floor(
      base_growth *
        number_of_tools *
        Math.log(information_transmission_speed + 1)
    );
    setShowNumberOfUsers(newNumberOfUsers > 0);
    setNumberOfUsers(newNumberOfUsers);
  }, [
    information_transmission_speed,
    number_of_tools,
    setShowNumberOfUsers,
    setNumberOfUsers,
  ]);

  useEffect(() => {
    updateNumberOfUsers();
  }, [
    information_transmission_speed,
    number_of_tools,
    personal_influence,
    updateNumberOfUsers,
  ]);

  // Update number of collaborators
  const updateShowNumberOfCollaborators = useCallback(() => {
    setShowNumberOfCollaborators(number_of_collaborators > 0);
  },[number_of_collaborators, setShowNumberOfCollaborators]);

  useEffect(() => {
    updateShowNumberOfCollaborators();
  },[number_of_collaborators, updateShowNumberOfCollaborators]);

  // Update number of contributors
  const updateShowNumberOfContributors = useCallback(() => {
    setShowNumberOfContributors(number_of_contributors > 0);
  },[number_of_contributors,setShowNumberOfContributors]);

  useEffect(() => {
    updateShowNumberOfContributors();
  },[number_of_contributors, updateShowNumberOfContributors]);

  // Update number of organizations
  const updateNumberOfOrganizations = useCallback(() => {
    setShowNumberOfOrganizations(number_of_organizations > 0);
  },[number_of_organizations,setShowNumberOfOrganizations]);

  useEffect(() => {
    updateNumberOfOrganizations();
  },[updateNumberOfOrganizations,number_of_organizations])

  // Update tool productivity
  const updateToolProductivity = useCallback(() => {
    const newProductivity =
      number_of_collaborators * 10 + number_of_contributors * 3;
    setToolProductivity(newProductivity);
    setShowToolProductivity(newProductivity > 0);
  }, [
    number_of_collaborators,
    number_of_contributors,
    setToolProductivity,
    setShowToolProductivity,
  ]);

  useEffect(() => {
    updateToolProductivity();
  }, [number_of_collaborators, number_of_contributors, updateToolProductivity]);
}
