import Vue from "vue";
import VueI18n from "vue-i18n";
import { createI18n } from "vue-i18n-composable";
import orders from "./orders.json";

Vue.use(VueI18n);

export const i18n = createI18n({
  locale: "fr",
  fallbackLocale: "en",
  silentTranslationWarn: process.env.NODE_ENV === "production",
  messages: {
    en: {
      dropdown: {
        deselectAll: "Deselect all",
        search: "Search",
        tags: "Tags",
        suppliers: "Suppliers",
        products: "Products",
        alerts: "Alerts"
      },
      search: "Search",
      products: "Products",
      site: "Site",
      suppliers: "suppliers",
      selectedSuppliers: "0 Suppliers | 1 Supplier | {count} Suppliers",
      lastOrderDate: "Latest order date",
      deliveryDate: "Delivery date",
      dateRange: "Date range",
      deleteWarningTitle: "Delete confirmation",
      deleteOrdersWarningText:
        "Are you sure that you want to remove the selected orders ?",
      deleteWarningConfirmButton: "YES, CONFIRM",
      deleteWarningCancelButton: "CANCEL",
      mergeWarningTitle: "Merge confirmation",
      mergeWarningText:
        "An order already exists for this date and supplier. Do you want to combine the two orders?\n This will add the current products and quantities to the order found at this new date.",
      mergeWarningConfirmButton: "YES, CONFIRM",
      mergeWarningCancelButton: "CANCEL",
      updateSuccess: "Successfully updated order(s)",
      updateError: "Order(s) could not be updated correctly",
      deselectAll: "Deselect all",
      notification: {
        error: "Error",
        success: "Success"
      },
      emptyData: "No data to display",
      discardTitle: "Discard all changes",
      discardText: "You will not be able to return to unsaved changes.",
      discardCancelButton: "RETURN TO EDIT",
      discardConfirmButton: "YES",
      dataJobsAlerts: {
        error: {
          subscriptionError:
            "Something went wrong during the fetch of data jobs update status"
        }
      },
      orderDetails: {
        error: {
          fetchOrderError:
            "Something went wrong during the fetch of the updated order"
        }
      },
      orders: {
        ...orders.en,
        items: "product | products",
        includesItems: "Number of products",
        volume: "Quantity",
        price: "Price",
        selected_orders: "Selected orders | Selected orders",
        orderConfirm: "Confirm Order",
        orderConfirmed: "Confirmed",
        orderDiscard: "Discard",
        orderConfirmSuccess: "Orders has been confirmed",
        orderConfirmError:
          "Something went wrong during the orders confirmation",
        updateSuccess: "Successfully updated order(s)",
        updateError: "Order(s) could not be updated correctly",
        sftpSuccess: "Exported successfully, please check your sftp space",
        sftpError: "Error exporting orders, please contact flowlity",
        deletionMessage: "Order deletion is processing",
        productIssue: "Product issue",
        orderIssue: "Order issue",
        unnecessarySupply: "are necessary | is necessary | are necessary",
        constraintsMetMessage: "All constraints are met",
        productDeletionMessage: "Product deletion is processing",
        deleteSupplySuccess: "Successfully deleted the selected product"
      },
      planning: {
        chart: {
          currentDay: "D-1",
          intervalMax: "Optimal stock level",
          intervalMin: "Optimal stock level",
          Minimum: "Minimum",
          Maximum: "Maximum",
          Stock: "Stock",
          Expired: "Expired",
          firmOrders: "Firm supply",
          allOrders: "Orders",
          plannedOrders: "Planned Orders"
        },
        error: {
          expiredStock:
            "Something went wrong during the fetch of expired stock",
          storageSites:
            "Something went wrong during the fetch of expired stock",
          transfers: "Something went wrong during the fetch of expired stock"
        }
      },
      demand: {
        chart: {
          title: "Forecasts",
          myforecast: "My forecast",
          demandForecastFlowlity: "Flowlity forecast",
          demandFinalForecast: "Final forecast",
          allOrders: "Forecasted shipments",
          firmOrders: "Confirmed shipments",
          historicalDemand: "Past demand",
          supplierDemand: "Actual customer consumption",
          maxFlowPred: "Confidence interval",
          minFlowPred: "Confidence interval"
        }
      },
      baseTable: {
        loadOlderData: "Load older data",
        simulation: "simulation only",
        simulationTooltipTitle: "Changes on firm supply",
        simulationTooltipSubtitle: "Changes in this row will not be saved.",
        simulationTooltipText: "Firm supply can be changed in your ERP only."
      },
      demandTable: {
        common: {
          updateSuccess: "The value has been properly saved",
          updateError: "An error occurred when saving your value",
          clientDemand: "Customer",
          aggregatedView: "Aggregated view",
          demandFinalForecast: "Final forecast",
          demandForecastExternal: "External forecast",
          salesOrders: "Firm demand"
        },
        regularView: {
          historicalDemand: "Past demand",
          demandForecastClient: "My forecast",
          demandForecastFlowlity: "Flowlity forecast"
        },
        supplierView: {
          historicalDemand: "Actual customer consumption",
          firmOrders: "Confirmed shipments",
          allOrders: "Forecasted shipments"
        },
        editingMyForecast: "Editing my forecast",
        punctualMessage:
          "Forecast not taken into account for the computation of stock limits min & max (Punctual product)",
        punctualMessageAggr:
          "Forecast not taken into account for at least one product (punctual) for the computation of stock limits min & max.",
        saveCancelButton: "RETURN TO EDIT",
        discardCancelButton: "RETURN TO EDIT",
        discardConfirmButton: "YES",
        saveConfirmButton: "YES",
        discardTitle: "Discard all changes",
        saveTitle: "Apply changes and update the forecasts?",
        discardText: "You will not be able to return to unsaved changes.",
        discardChanges: "Discard Changes",
        saveUpdateButton: "Save",
        saving: "Saving"
      },
      planningTable: {
        restOf: "Rest of ",
        currentDay: "D-1",
        leadTime: "lead time days",
        orders: "My Supply",
        finalForecast: "Final forecast",
        status3Supplies: "Firm supply",
        maximum: "Stock max",
        stock: "Stock",
        stockCoverage: "Stock Coverage in days",
        stockExpired: "Expiring Stock",
        minimum: "Stock min",
        aggregatedView: "Aggregated view",
        recomputeSuppliesSuccess:
          "The supply recommendations were recomputed, refresh the page if you want to see them",
        recomputeSuppliesInfo:
          "We don't have enough historical data on this product to compute new supply recommendations",
        noSupplierWarning:
          "This product has no supplier linked, please add it in ",
        productAdminPage: "product admin page",
        transfer: "Transfer",
        punctualMessage:
          "This product has a punctual historical demand pattern. Computation of Stock Min and Stock Max are following alternative statistical methods.",
        noStock:
          "No stock data was received for this product. Therefore, stock was set to 0.",
        justInTime: "No stock data for this just-in-time product.",
        saveCancelButton: "RETURN TO EDIT",
        discardCancelButton: "RETURN TO EDIT",
        discardConfirmButton: "YES",
        saveConfirmButton: "YES",
        discardTitle: "Discard all changes",
        saveTitle: "Apply changes and update order(s)?",
        discardText: "You will not be able to return to unsaved changes.",
        discardChanges: "Discard Changes",
        saveUpdateButton: "Save",
        saving: "Saving",
        editingMySupply: "Editing my supply"
      },
      productSearch: {
        alerts: "Alerts",
        selectedAlerts: "0 Alerts  | 1 Alert | {count} Alerts",
        selectedProductsFiltersTags: "0 tags  | 1 tag  | {count} Tags",
        outOfStock: "Out of stock",
        belowMin: "Below optimal stock level",
        aboveMax: "Above optimal stock level",
        expiringStocks: "Expiring Stocks"
      },
      forecastsReview: {
        demand_forecast: "Demand",
        planning_forecast: "Planning",
        name: "Name",
        productName: "Product Name",
        tagName: "Tag Name",
        reference: "Reference",
        supplier: "Supplier",
        product: "Product",
        alerts: "Alerts",
        multipleIssues: "Multiple alerts",
        customer: "Customer",
        selectCustomer: "Select a customer",
        suppliers: "Suppliers | Supplier | Suppliers",
        noSuppliers: "No Suppliers Found",
        tags: "All Tags",
        tag: "Tag",
        noTags: "No Tags Found",
        searchProductPlaceholder:
          "Search by product reference, product name or supplier",
        searchTagPlaceholder: "Search by tag name",
        searchProduct: "By product",
        searchTag: "By tag",
        tooltipLegendFixReco:
          "The recommendations are fixed during this period",
        legendFixReco: "Fixed recommendations period",
        fixRecoButton: "FIX PERIOD",
        cancelFixRecoButton: "CANCEL FIXATION",
        successSavingNewFixingRecoDate:
          "The new date has been successfully saved",
        successDeletingNewFixingRecoDate:
          "The date has been successfully deleted",
        errorSavingNewFixingRecoDate:
          "An error occurred during the update of the date",
        legendDemandFrozenHorizon: "Frozen zone",
        tooltipLegendDemandFrozenHorizon:
          "Only firm demand will be taken in the final forecast during this period",
        expiringStocks: "Expiring Stocks",
        outOfStock: "Out of stock",
        belowMin: "Below optimal stock level",
        products: "Products | Product | Products",
        tagsCountable: "Tags  | Tag  | Tags",
        aboveMax: "Above optimal stock level",
        deselectAll: "Deselect all",
        selected: "Selected",
        viewDetails: "View Details",
        viewAggregatedDetails: "View Aggregated Details",
        noResultsFound: "No results found",
        refineSearch: "Try to refine your search & filters"
      },
      InputLineCell: {
        validated: "Warning, the order for this supply has been validated",
        flowlitySupply: "Recommendation by Flowlity",
        lotSize: "Lot size",
        moq: "MOQ",
        originalValue: "Original value",
        empty: "empty",
        dayMarkedAs: "This day is marked as",
        weekMarkedAs: "This week is marked as",
        monthMarkedAs: "This month is marked as",
        fullyFrozen: "fully frozen",
        partlyFrozen: "partly frozen"
      },
      header: {
        editProfile: "Edit your profile",
        lang: "Language",
        settings: "Settings",
        logout: "Logout"
      },
      siteDropdown: {
        unsavedWarningTitle: "Unsaved work",
        unsavedWarningText: "Your changes will be automatically discarded",
        unsavedWarningConfirmButton: "OK, DISCARD",
        unsavedWarningCancelButton: "KEEP EDITING"
      }
    },
    fr: {
      dropdown: {
        deselectAll: "Tout désélectionner",
        search: "Recherche",
        tags: "Tags",
        suppliers: "Suppliers",
        products: "Produits",
        alerts: "Alertes"
      },
      search: "Recherche",
      products: "Produits",
      site: "Site",
      suppliers: "fournisseurs",
      selectedSuppliers: "Fournisseurs sélectionnés",
      lastOrderDate: "Date de commande",
      deliveryDate: "Date de livraison",
      dateRange: "Période",
      deleteWarningTitle: "Confirmation de suppression",
      deleteOrdersWarningText:
        "Etes vous sûr de vouloir supprimer les commandes sélectionnées",
      deleteWarningConfirmButton: "JE CONFIRME",
      deleteWarningCancelButton: "ANNULER",
      mergeWarningTitle: "Confirmation de combinaison",
      mergeWarningText:
        "Une commande existe déjà pour cette date et fournisseur. Voulez-vous combiner les deux commandes?\n Ceci aura pour effet d'ajouter les produits et quantités à la commande trouvée à cette nouvelle date.",
      mergeWarningConfirmButton: "JE CONFIRME",
      mergeWarningCancelButton: "ANNULER",
      updateSuccess: "Commande(s) correctement mise(s) à jour",
      updateError:
        "Un problème a été rencontré pendant la mise à jour des commandes",
      notification: {
        error: "Erreur",
        success: "Succès"
      },
      emptyData: "Pas de donnée disponible",
      discardCancelButton: "CONTINUER D'EDITER",
      discardConfirmButton: "OUI",
      discardTitle: "Annuler les changements",
      discardText: "Vous ne pourrez plus récupérer les changements effectués.",
      deselectAll: "Tout désélectionner",
      dataJobsAlerts: {
        error: {
          subscriptionError:
            "Une erreur est survenue lors de la récuperation du status de la mise à jour des données"
        }
      },
      orderDetails: {
        error: {
          fetchOrderError:
            "Une erreur est survenue lors de la récuperation de la commande mise à jour"
        }
      },
      planning: {
        chart: {
          currentDay: "J-1",
          intervalMax: "Zone de stock optimal",
          intervalMin: "Zone de stock optimal",
          Minimum: "Minimum",
          Maximum: "Maximum",
          Stock: "Stock",
          Expired: "Expirant",
          firmOrders: "Approvisionnement ferme",
          allOrders: "Commandes",
          plannedOrders: "Commandes planifiées"
        },
        error: {
          expiredStock:
            "Une erreur est survenue lors de la récuperation du stock expiré",
          storageSites:
            "Une erreur est survenue lors de la récuperation du stock expiré",
          transfers:
            "Une erreur est survenue lors de la récuperation du stock expiré"
        }
      },
      demand: {
        chart: {
          title: "Prédictions",
          myforecast: "Ma prédiction",
          demandFinalForecast: "Prédiction finale",
          demandForecastFlowlity: "Prédiction Flowlity",
          allOrders: "Expéditions prévisionnelles",
          firmOrders: "Expéditions confirmées",
          historicalDemand: "Demande passée",
          supplierDemand: "Consommation réelle du client",
          maxFlowPred: "Intervalle de confiance",
          minFlowPred: "Intervalle de confiance"
        }
      },
      baseTable: {
        loadOlderData: "Données passées",
        simulation: "simulation uniquement",
        simulationTooltipTitle: "Changement sur l'approvisionnement ferme",
        simulationTooltipSubtitle: "Les changements ne seront pas sauvegardés.",
        simulationTooltipText:
          "L'approvisionnement ferme ne peut être modifié que dans votre ERP."
      },
      demandTable: {
        common: {
          updateSuccess: "La donnée a bien été enregistrée",
          updateError:
            "Une erreur s'est produite pendant la sauvegarde de votre donnée",
          clientDemand: "Client",
          aggregatedView: "Vue aggrégée",
          demandFinalForecast: "Prédiction finale",
          demandForecastExternal: "Prédiction externe",
          salesOrders: "Demande ferme"
        },
        regularView: {
          demandForecastClient: "Ma prédiction",
          demandForecastFlowlity: "Prédiction Flowlity",
          myforecast: "Ma prédiction",
          historicalDemand: "Demande passée",
          flowlityDemand: "Prédiction Flowlity"
        },
        supplierView: {
          historicalDemand: "Consommation réelle du client",
          firmOrders: "Expéditions confirmées",
          allOrders: "Expéditions prévisionnelles"
        },
        editingMyForecast: "Édition de ma prédiction",
        punctualMessage:
          "La prévision n'est pas prise en compte pour le calcul des seuils de stock min & max (Produit ponctuel)",
        punctualMessageAggr:
          "La prévision d'au moins un produit (ponctuel) n'est pas prise en compte pour le calcul des seuils de stock min & max",
        saveCancelButton: "CONTINUER D'EDITER",
        discardCancelButton: "CONTINUER D'EDITER",
        discardConfirmButton: "OUI",
        saveConfirmButton: "OUI",
        discardTitle: "Annuler les changements",
        saveTitle:
          "Appliquer les changements et mettre à jour les prédictions ?",
        discardText:
          "Vous ne pourrez plus récupérer les changements effectués.",
        discardChanges: "Annuler",
        saveUpdateButton: "Sauvegarder",
        saving: "Sauvegarde en cours"
      },
      planningTable: {
        restOf: "Fin de ",
        currentDay: "J-1",
        leadTime: "jours d'appro",
        orders: "Mon Plan",
        finalForecast: "Prédiction finale",
        status3Supplies: "Approvisionnement ferme",
        maximum: "Stock max",
        stock: "Stock",
        stockCoverage: "Couverture de stock en jours",
        stockExpired: "Stock expirant",
        minimum: "Stock min",
        aggregatedView: "Vue agrégée",
        recomputeSuppliesSuccess:
          "Les recommandations de supply ont été recalculées, rafraichissez la page pour les voir",
        recomputeSuppliesInfo:
          "Nous manquons de données historiques sur ce produit pour recalculer des recommandations de supply",
        noSupplierWarning:
          "Ce produit n'a aucun fournisseur lié, veuillez l'ajouter dans la page ",
        productAdminPage: "administration du produit",
        transfer: "Transfert",
        punctualMessage:
          "Les historiques de demande de ce produit sont ponctuels. Les valeurs de stock minimum et maximum suivent des lois statistiques alternatives.",
        noStock:
          "Nous n’avons pas reçu de donnée de stock pour ce produit. Nous avons donc défini le stock à 0.",
        justInTime:
          "Nous n'avons pas de donnée de stock pour ce produit flux tendu.",
        saveCancelButton: "CONTINUER D'EDITER",
        discardCancelButton: "CONTINUER D'EDITER",
        discardConfirmButton: "OUI",
        saveConfirmButton: "OUI",
        discardTitle: "Annuler les changements",
        saveTitle: "Appliquer les changements et mettre à jour les commandes ?",
        discardText:
          "Vous ne pourrez plus récupérer les changements effectués.",
        discardChanges: "Annuler",
        saveUpdateButton: "Sauvegarder",
        saving: "Sauvegarde en cours",
        editingMySupply: "Édition de mon plan"
      },
      productSearch: {
        alerts: "Alertes",
        selectedAlerts: "0 Alerte | 1 Alerte | {count} Alertes",
        selectedProductsFiltersTags: "0 Tag | 1 Tag | {count} Tags",
        outOfStock: "Rupture de stock",
        belowMin: "En dessous du stock optimal",
        aboveMax: "Au dessus du stock optimal",
        expiringStocks: "Stock expiré"
      },
      forecastsReview: {
        demand_forecast: " Demande",
        planning_forecast: "Planning",
        name: "Nom",
        productName: "Désignation produit",
        tagName: "Tag",
        reference: "Référence",
        supplier: "Fournisseur",
        product: "Produit",
        alerts: "Alertes",
        multipleIssues: "Plusieurs alertes",
        customer: "Client",
        selectCustomer: "Sélectionner un client",
        suppliers: "Fournisseurs",
        noSuppliers: "Aucun Fournisseur Trouvé",
        tags: "Tags",
        tag: "Tag",
        noTags: "Aucun Tag Trouvé",
        searchProductPlaceholder:
          "Chercher par référence produit, nom de produit ou fournisseur",
        searchTagPlaceholder: "Chercher par nom de tag",
        searchProduct: "Par Produit",
        searchTag: "Par Tag",
        tooltipLegendFixReco:
          "Les recommandations sont figées durant cette période",
        legendFixReco: "Recommandations figées",
        fixRecoButton: "FIGER",
        cancelFixRecoButton: "DÉFIGER",
        successSavingNewFixingRecoDate:
          "La nouvelle date a bien été enregistrée",
        successDeletingNewFixingRecoDate: "La date a bien été supprimée",
        errorSavingNewFixingRecoDate:
          "Une erreur est survenue durant la mise à jour de la date",
        legendDemandFrozenHorizon: "Zone gelée",
        tooltipLegendDemandFrozenHorizon:
          "Seule la demande ferme sera prise en compte pour la prédiction finale durant cette période",
        expiringStocks: "Stock expiré",
        outOfStock: "Rupture de stock",
        belowMin: "En dessous du stock optimal",
        products: "produit | produit | produits",
        tagsCountable: "tags  | tag  | tags",
        aboveMax: "Au dessus du stock optimal",
        deselectAll: "Tout désélectionner",
        selected: "sélectionné | sélectionné | sélectionnés",
        viewDetails: "Voir le détail",
        viewAggregatedDetails: "Voir le détail agrégé",
        noResultsFound: "Aucun résultat",
        refineSearch: "Modifiez votre recherche et vos filtres"
      },
      orders: {
        ...orders.fr,
        items: "produit | produits",
        includesItems: "Nombre de produits",
        selected_orders: "Commande sélectionnée | Commandes sélectionnées",
        volume: "Quantité",
        price: "Prix",
        orderConfirm: "Prévalider la commande",
        orderConfirmed: "Prévalidée",
        orderDiscard: "Annuler",
        orderConfirmSuccess: "Vos commandes ont été prévalidées",
        orderConfirmError:
          "Une erreur est survenue lors de la prévalidation des commandes",
        updateSuccess: "Commande(s) correctement mise(s) à jour",
        updateError:
          "Un problème a été rencontré pendant la mise à jour des commandes",
        sftpSuccess: "Exporté avec succès, veuillez vérifier votre espace sftp",
        sftpError:
          "Erreur lors de l'exportation des commandes, veuillez contacter flowlity",
        deletionMessage: "La suppression est en cours",
        productIssue: "Lié aux produits",
        orderIssue: "Lié à la commande",
        unnecessarySupply: "est nécessaire | est nécessaire | sont nécessaires",
        constraintsMetMessage: "Toutes les contraintes sont respectées",
        productDeletionMessage: "La suppression est en cours",
        deleteSupplySuccess: "Le produit a été supprimé avec succès"
      },
      InputLineCell: {
        validated: "Attention, la commande pour cette supply a été validée",
        flowlitySupply: "Recommandation par Flowlity",
        lotSize: "Taille de lot",
        moq: "Mini de commande",
        originalValue: "Valeur initiale",
        empty: "vide",
        dayMarkedAs: "Ce jour est",
        weekMarkedAs: "Cette semaine est",
        monthMarkedAs: "Ce mois est",
        fullyFrozen: "gelé | gelée",
        partlyFrozen: "partiellement gelé | partiellement gelée"
      },
      header: {
        editProfile: "Modifier votre profil",
        lang: "Choix de langue",
        settings: "Configurations",
        logout: "Déconnexion"
      },
      siteDropdown: {
        unsavedWarningTitle: "Des données sont non sauvegardées",
        unsavedWarningText: "Vos changements ne seront pas sauvegardés",
        unsavedWarningConfirmButton: "OK",
        unsavedWarningCancelButton: "CONTINUER D'EDITER"
      }
    }
  }
});
