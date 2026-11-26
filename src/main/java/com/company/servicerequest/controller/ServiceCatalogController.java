package com.company.servicerequest.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
public class ServiceCatalogController {
    private static final List<ServiceCatalogItem> SERVICES = List.of(
            new ServiceCatalogItem("home-cleaning", "Home Cleaning", "Cleaning for houses and apartments."),
            new ServiceCatalogItem("office-cleaning", "Office Cleaning", "Cleaning for offices and workspaces."),
            new ServiceCatalogItem("laundry", "Laundry Service", "Laundry collection, washing, drying, and folding."),
            new ServiceCatalogItem("mobile-car-wash", "Mobile Car Wash", "A car wash at your home or workplace."),
            new ServiceCatalogItem("other-cleaning", "Other Cleaning Service", "Tell us about another cleaning need."));

    @GetMapping
    public List<ServiceCatalogItem> listServices() {
        return SERVICES;
    }

    public record ServiceCatalogItem(String id, String name, String description) {}
}
