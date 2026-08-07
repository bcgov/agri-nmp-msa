## Applying templates

### BuildConfigs

BuildConfigs should be applied in 624dc1-tools. Run `oc apply -f [file]` in the terminal. These yaml files create both the BuildConfig and the ImageStream they output to.

### Deployments

Deployments are applied to the dev, test, and prod environment projects. The yaml files create the Deployment, a PersistentVolumeClaim if it uses one, its Service, and, for hosted services, the Route. 

The postgresql yaml is not a template and is applied by running `oc apply -f nmp-msa-postgresql-deployment.yaml`. All other deployment files are templates. To apply a template, run `oc process -f [file] | oc apply -f -` All templates are configured for the dev environment. To apply them to a different environment, set the parameters with the flag `-p [name]=[value]` after the file name.