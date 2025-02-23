// What functions to include: background state updates that should run automatically based on state changes
// Do not put player-action-based update functions here
"use client";
import { useCallback, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";

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
    value_generated,
    // setValueGenerated,    
  } = useGameStore();

  // Update role based on number_of_tools, personal_influence, and value_generated
  const updateRole = useCallback(() => {
    const rolesList = [
      "Coding Enthusiast",
      "Independent Developer",
      "Open-source Collaborator",
      "Open-source Organization Founder",
    ];
    const rolesIdx = rolesList.indexOf(role);
    if ((rolesIdx == 0 && number_of_tools > 10) || (rolesIdx == 1 && number_of_collaborators > 0) || (rolesIdx == 2 && value_generated > 100000)) {
      setRole(rolesList[rolesIdx + 1]);
    }
  },[number_of_tools, number_of_collaborators, role, setRole, value_generated]);

  useEffect(() => {
    updateRole();
  },[number_of_tools, number_of_collaborators, role, value_generated, updateRole]);

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
