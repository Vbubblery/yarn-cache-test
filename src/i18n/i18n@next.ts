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
        deselectAll: "Tout d??s??lectionner",
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
      selectedSuppliers: "Fournisseurs s??lectionn??s",
      lastOrderDate: "Date de commande",
      deliveryDate: "Date de livraison",
      dateRange: "P??riode",
      deleteWarningTitle: "Confirmation de suppression",
      deleteOrdersWarningText:
        "Etes vous s??r de vouloir supprimer les commandes s??lectionn??es",
      deleteWarningConfirmButton: "JE CONFIRME",
      deleteWarningCancelButton: "ANNULER",
      mergeWarningTitle: "Confirmation de combinaison",
      mergeWarningText:
        "Une commande existe d??j?? pour cette date et fournisseur. Voulez-vous combiner les deux commandes?\n Ceci aura pour effet d'ajouter les produits et quantit??s ?? la commande trouv??e ?? cette nouvelle date.",
      mergeWarningConfirmButton: "JE CONFIRME",
      mergeWarningCancelButton: "ANNULER",
      updateSuccess: "Commande(s) correctement mise(s) ?? jour",
      updateError:
        "Un probl??me a ??t?? rencontr?? pendant la mise ?? jour des commandes",
      notification: {
        error: "Erreur",
        success: "Succ??s"
      },
      emptyData: "Pas de donn??e disponible",
      discardCancelButton: "CONTINUER D'EDITER",
      discardConfirmButton: "OUI",
      discardTitle: "Annuler les changements",
      discardText: "Vous ne pourrez plus r??cup??rer les changements effectu??s.",
      deselectAll: "Tout d??s??lectionner",
      dataJobsAlerts: {
        error: {
          subscriptionError:
            "Une erreur est survenue lors de la r??cuperation du status de la mise ?? jour des donn??es"
        }
      },
      orderDetails: {
        error: {
          fetchOrderError:
            "Une erreur est survenue lors de la r??cuperation de la commande mise ?? jour"
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
          plannedOrders: "Commandes planifi??es"
        },
        error: {
          expiredStock:
            "Une erreur est survenue lors de la r??cuperation du stock expir??",
          storageSites:
            "Une erreur est survenue lors de la r??cuperation du stock expir??",
          transfers:
            "Une erreur est survenue lors de la r??cuperation du stock expir??"
        }
      },
      demand: {
        chart: {
          title: "Pr??dictions",
          myforecast: "Ma pr??diction",
          demandFinalForecast: "Pr??diction finale",
          demandForecastFlowlity: "Pr??diction Flowlity",
          allOrders: "Exp??ditions pr??visionnelles",
          firmOrders: "Exp??ditions confirm??es",
          historicalDemand: "Demande pass??e",
          supplierDemand: "Consommation r??elle du client",
          maxFlowPred: "Intervalle de confiance",
          minFlowPred: "Intervalle de confiance"
        }
      },
      baseTable: {
        loadOlderData: "Donn??es pass??es",
        simulation: "simulation uniquement",
        simulationTooltipTitle: "Changement sur l'approvisionnement ferme",
        simulationTooltipSubtitle: "Les changements ne seront pas sauvegard??s.",
        simulationTooltipText:
          "L'approvisionnement ferme ne peut ??tre modifi?? que dans votre ERP."
      },
      demandTable: {
        common: {
          updateSuccess: "La donn??e a bien ??t?? enregistr??e",
          updateError:
            "Une erreur s'est produite pendant la sauvegarde de votre donn??e",
          clientDemand: "Client",
          aggregatedView: "Vue aggr??g??e",
          demandFinalForecast: "Pr??diction finale",
          demandForecastExternal: "Pr??diction externe",
          salesOrders: "Demande ferme"
        },
        regularView: {
          demandForecastClient: "Ma pr??diction",
          demandForecastFlowlity: "Pr??diction Flowlity",
          myforecast: "Ma pr??diction",
          historicalDemand: "Demande pass??e",
          flowlityDemand: "Pr??diction Flowlity"
        },
        supplierView: {
          historicalDemand: "Consommation r??elle du client",
          firmOrders: "Exp??ditions confirm??es",
          allOrders: "Exp??ditions pr??visionnelles"
        },
        editingMyForecast: "??dition de ma pr??diction",
        punctualMessage:
          "La pr??vision n'est pas prise en compte pour le calcul des seuils de stock min & max (Produit ponctuel)",
        punctualMessageAggr:
          "La pr??vision d'au moins un produit (ponctuel) n'est pas prise en compte pour le calcul des seuils de stock min & max",
        saveCancelButton: "CONTINUER D'EDITER",
        discardCancelButton: "CONTINUER D'EDITER",
        discardConfirmButton: "OUI",
        saveConfirmButton: "OUI",
        discardTitle: "Annuler les changements",
        saveTitle:
          "Appliquer les changements et mettre ?? jour les pr??dictions ?",
        discardText:
          "Vous ne pourrez plus r??cup??rer les changements effectu??s.",
        discardChanges: "Annuler",
        saveUpdateButton: "Sauvegarder",
        saving: "Sauvegarde en cours"
      },
      planningTable: {
        restOf: "Fin de ",
        currentDay: "J-1",
        leadTime: "jours d'appro",
        orders: "Mon Plan",
        finalForecast: "Pr??diction finale",
        status3Supplies: "Approvisionnement ferme",
        maximum: "Stock max",
        stock: "Stock",
        stockCoverage: "Couverture de stock en jours",
        stockExpired: "Stock expirant",
        minimum: "Stock min",
        aggregatedView: "Vue agr??g??e",
        recomputeSuppliesSuccess:
          "Les recommandations de supply ont ??t?? recalcul??es, rafraichissez la page pour les voir",
        recomputeSuppliesInfo:
          "Nous manquons de donn??es historiques sur ce produit pour recalculer des recommandations de supply",
        noSupplierWarning:
          "Ce produit n'a aucun fournisseur li??, veuillez l'ajouter dans la page ",
        productAdminPage: "administration du produit",
        transfer: "Transfert",
        punctualMessage:
          "Les historiques de demande de ce produit sont ponctuels. Les valeurs de stock minimum et maximum suivent des lois statistiques alternatives.",
        noStock:
          "Nous n???avons pas re??u de donn??e de stock pour ce produit. Nous avons donc d??fini le stock ?? 0.",
        justInTime:
          "Nous n'avons pas de donn??e de stock pour ce produit flux tendu.",
        saveCancelButton: "CONTINUER D'EDITER",
        discardCancelButton: "CONTINUER D'EDITER",
        discardConfirmButton: "OUI",
        saveConfirmButton: "OUI",
        discardTitle: "Annuler les changements",
        saveTitle: "Appliquer les changements et mettre ?? jour les commandes ?",
        discardText:
          "Vous ne pourrez plus r??cup??rer les changements effectu??s.",
        discardChanges: "Annuler",
        saveUpdateButton: "Sauvegarder",
        saving: "Sauvegarde en cours",
        editingMySupply: "??dition de mon plan"
      },
      productSearch: {
        alerts: "Alertes",
        selectedAlerts: "0 Alerte | 1 Alerte | {count} Alertes",
        selectedProductsFiltersTags: "0 Tag | 1 Tag | {count} Tags",
        outOfStock: "Rupture de stock",
        belowMin: "En dessous du stock optimal",
        aboveMax: "Au dessus du stock optimal",
        expiringStocks: "Stock expir??"
      },
      forecastsReview: {
        demand_forecast: " Demande",
        planning_forecast: "Planning",
        name: "Nom",
        productName: "D??signation produit",
        tagName: "Tag",
        reference: "R??f??rence",
        supplier: "Fournisseur",
        product: "Produit",
        alerts: "Alertes",
        multipleIssues: "Plusieurs alertes",
        customer: "Client",
        selectCustomer: "S??lectionner un client",
        suppliers: "Fournisseurs",
        noSuppliers: "Aucun Fournisseur Trouv??",
        tags: "Tags",
        tag: "Tag",
        noTags: "Aucun Tag Trouv??",
        searchProductPlaceholder:
          "Chercher par r??f??rence produit, nom de produit ou fournisseur",
        searchTagPlaceholder: "Chercher par nom de tag",
        searchProduct: "Par Produit",
        searchTag: "Par Tag",
        tooltipLegendFixReco:
          "Les recommandations sont fig??es durant cette p??riode",
        legendFixReco: "Recommandations fig??es",
        fixRecoButton: "FIGER",
        cancelFixRecoButton: "D??FIGER",
        successSavingNewFixingRecoDate:
          "La nouvelle date a bien ??t?? enregistr??e",
        successDeletingNewFixingRecoDate: "La date a bien ??t?? supprim??e",
        errorSavingNewFixingRecoDate:
          "Une erreur est survenue durant la mise ?? jour de la date",
        legendDemandFrozenHorizon: "Zone gel??e",
        tooltipLegendDemandFrozenHorizon:
          "Seule la demande ferme sera prise en compte pour la pr??diction finale durant cette p??riode",
        expiringStocks: "Stock expir??",
        outOfStock: "Rupture de stock",
        belowMin: "En dessous du stock optimal",
        products: "produit | produit | produits",
        tagsCountable: "tags  | tag  | tags",
        aboveMax: "Au dessus du stock optimal",
        deselectAll: "Tout d??s??lectionner",
        selected: "s??lectionn?? | s??lectionn?? | s??lectionn??s",
        viewDetails: "Voir le d??tail",
        viewAggregatedDetails: "Voir le d??tail agr??g??",
        noResultsFound: "Aucun r??sultat",
        refineSearch: "Modifiez votre recherche et vos filtres"
      },
      orders: {
        ...orders.fr,
        items: "produit | produits",
        includesItems: "Nombre de produits",
        selected_orders: "Commande s??lectionn??e | Commandes s??lectionn??es",
        volume: "Quantit??",
        price: "Prix",
        orderConfirm: "Pr??valider la commande",
        orderConfirmed: "Pr??valid??e",
        orderDiscard: "Annuler",
        orderConfirmSuccess: "Vos commandes ont ??t?? pr??valid??es",
        orderConfirmError:
          "Une erreur est survenue lors de la pr??validation des commandes",
        updateSuccess: "Commande(s) correctement mise(s) ?? jour",
        updateError:
          "Un probl??me a ??t?? rencontr?? pendant la mise ?? jour des commandes",
        sftpSuccess: "Export?? avec succ??s, veuillez v??rifier votre espace sftp",
        sftpError:
          "Erreur lors de l'exportation des commandes, veuillez contacter flowlity",
        deletionMessage: "La suppression est en cours",
        productIssue: "Li?? aux produits",
        orderIssue: "Li?? ?? la commande",
        unnecessarySupply: "est n??cessaire | est n??cessaire | sont n??cessaires",
        constraintsMetMessage: "Toutes les contraintes sont respect??es",
        productDeletionMessage: "La suppression est en cours",
        deleteSupplySuccess: "Le produit a ??t?? supprim?? avec succ??s"
      },
      InputLineCell: {
        validated: "Attention, la commande pour cette supply a ??t?? valid??e",
        flowlitySupply: "Recommandation par Flowlity",
        lotSize: "Taille de lot",
        moq: "Mini de commande",
        originalValue: "Valeur initiale",
        empty: "vide",
        dayMarkedAs: "Ce jour est",
        weekMarkedAs: "Cette semaine est",
        monthMarkedAs: "Ce mois est",
        fullyFrozen: "gel?? | gel??e",
        partlyFrozen: "partiellement gel?? | partiellement gel??e"
      },
      header: {
        editProfile: "Modifier votre profil",
        lang: "Choix de langue",
        settings: "Configurations",
        logout: "D??connexion"
      },
      siteDropdown: {
        unsavedWarningTitle: "Des donn??es sont non sauvegard??es",
        unsavedWarningText: "Vos changements ne seront pas sauvegard??s",
        unsavedWarningConfirmButton: "OK",
        unsavedWarningCancelButton: "CONTINUER D'EDITER"
      }
    }
  }
});
